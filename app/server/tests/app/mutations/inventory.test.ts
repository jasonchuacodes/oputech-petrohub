import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { hash } from 'argon2'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import request from 'supertest'
import { configureApplication } from '../../../src/configure-application'
import { TenantService } from '../../../src/modules/tenants/tenant.service'
import { UserRole } from '../../../src/modules/users/schemas/user.schema'
import { UsersService } from '../../../src/modules/users/users.service'

describe('inventory count reconciliation', () => {
  let replicaSet: MongoMemoryReplSet
  let app: INestApplication
  let tenantId: string
  let adminToken: string
  let memberToken: string
  let sequence = 0

  beforeAll(async () => {
    replicaSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
    process.env.NODE_ENV = 'test'
    process.env.MONGODB_URI = replicaSet.getUri('petromate-inventory-test')
    process.env.CLIENT_ORIGIN = 'http://localhost:5173'
    process.env.AUTH_ACCESS_TOKEN_SECRET = 'test-access-secret-at-least-32-characters'
    process.env.AUTH_REFRESH_TOKEN_SECRET = 'test-refresh-secret-at-least-32-characters'
    process.env.SUPERADMIN_SCRIPT_SECRET = 'test-superadmin-secret-at-least-32-characters'
    process.env.LOG_LEVEL = 'silent'

    const { AppModule } = await import('../../../src/app.module')
    app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] })
    configureApplication(app)
    await app.init()

    const users = app.get(UsersService)
    const tenants = app.get(TenantService)
    const owner = await users.create({
      username: 'inventory-owner',
      passwordHash: await hash('OwnerPassword123'),
      role: UserRole.SUPERADMIN,
    })
    const tenant = await tenants.create(owner._id, { name: 'Inventory Station' })
    tenantId = tenant._id.toHexString()
    await users.create({
      username: 'inventory-admin',
      passwordHash: await hash('AdminPassword123'),
      role: UserRole.ADMIN,
      accountHolderId: owner._id,
      tenantIds: [tenant._id],
    })
    await users.create({
      username: 'inventory-member',
      passwordHash: await hash('MemberPassword123'),
      role: UserRole.MEMBER,
      accountHolderId: owner._id,
      tenantIds: [tenant._id],
    })
    adminToken = await login('inventory-admin', 'AdminPassword123')
    memberToken = await login('inventory-member', 'MemberPassword123')
  }, 60_000)

  afterAll(async () => {
    await app?.close()
    await replicaSet?.stop()
  })

  it('sets the absolute count and records its signed difference and note', async () => {
    const productId = await createProduct('10')
    const response = await reconcile(adminToken, {
      productId,
      stockCount: '15',
      note: '  Counted shelf stock  ',
      idempotencyKey: 'reconcile-increase-count',
    })

    expect(response.body.errors).toBeUndefined()
    expect(response.body.data.reconcileInventoryProductCount).toMatchObject({
      productId,
      type: 'reconcile_count',
      quantityChange: '5',
      balanceBefore: '10',
      balanceAfter: '15',
      reason: 'Counted shelf stock',
      actorName: 'inventory-admin',
    })
    expect(await productStock(productId)).toBe('15')

    const history = await graphql(adminToken, `query ($input: StockMovementsInput!) {
      stockMovements(input: $input) { items { type quantityChange balanceBefore balanceAfter reason } }
    }`, { input: { productId, first: 10 } })
    expect(history.body.data.stockMovements.items[0]).toMatchObject({
      type: 'reconcile_count',
      quantityChange: '5',
      reason: 'Counted shelf stock',
    })
  })

  it('replays the original movement without overriding later stock changes', async () => {
    const productId = await createProduct('10')
    const input = {
      productId,
      stockCount: '8',
      note: 'Verified physical count',
      idempotencyKey: 'reconcile-idempotent-count',
    }
    const original = await reconcile(adminToken, input)
    const originalId = original.body.data.reconcileInventoryProductCount.id as string

    const laterMovement = await graphql(adminToken, `mutation ($input: RecordStockMovementInput!) {
      recordStockMovement(input: $input) { balanceAfter }
    }`, { input: { productId, type: 'stock_in', quantity: '2', reason: 'Later delivery', idempotencyKey: 'later-stock-delivery' } })
    expect(laterMovement.body.errors).toBeUndefined()
    expect(laterMovement.body.data.recordStockMovement.balanceAfter).toBe('10')

    const replay = await reconcile(adminToken, input)
    expect(replay.body.errors).toBeUndefined()
    expect(replay.body.data.reconcileInventoryProductCount.id).toBe(originalId)
    expect(await productStock(productId)).toBe('10')

    const conflict = await reconcile(adminToken, { ...input, stockCount: '7' })
    expect(conflict.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'CONFLICT' })
    expect(await productStock(productId)).toBe('10')
  })

  it('records a zero difference while enforcing count validation and admin access', async () => {
    const productId = await createProduct('4')
    const unchanged = await reconcile(adminToken, {
      productId,
      stockCount: '4',
      idempotencyKey: 'reconcile-zero-count',
    })
    expect(unchanged.body.errors).toBeUndefined()
    expect(unchanged.body.data.reconcileInventoryProductCount).toMatchObject({
      quantityChange: '0',
      balanceBefore: '4',
      balanceAfter: '4',
      reason: null,
    })

    const invalid = await reconcile(adminToken, {
      productId,
      stockCount: '-1',
      idempotencyKey: 'reconcile-negative-count',
    })
    expect(invalid.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'INVALID_INPUT' })

    const forbidden = await reconcile(memberToken, {
      productId,
      stockCount: '3',
      idempotencyKey: 'reconcile-forbidden-count',
    })
    expect(forbidden.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'FORBIDDEN' })
    expect(await productStock(productId)).toBe('4')
  })

  async function login(username: string, password: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username, password })
      .expect(200)
    return response.body.accessToken as string
  }

  async function createProduct(openingStock: string): Promise<string> {
    sequence += 1
    const response = await graphql(adminToken, `mutation ($input: CreateInventoryProductInput!) {
      createInventoryProduct(input: $input) { id }
    }`, { input: {
      name: `Test lubricant ${sequence}`,
      unit: 'bottle',
      unitPrice: '100.00',
      openingStock,
      idempotencyKey: `inventory-product-${sequence}`,
    } })
    expect(response.body.errors).toBeUndefined()
    return response.body.data.createInventoryProduct.id as string
  }

  async function productStock(productId: string): Promise<string> {
    const response = await graphql(adminToken, `query ($input: InventoryProductsInput!) {
      inventoryProducts(input: $input) { items { id stockCount } }
    }`, { input: { limit: 100 } })
    return response.body.data.inventoryProducts.items.find((item: { id: string }) => item.id === productId).stockCount as string
  }

  async function reconcile(token: string, input: Record<string, unknown>) {
    return graphql(token, `mutation ($input: ReconcileInventoryProductCountInput!) {
      reconcileInventoryProductCount(input: $input) {
        id productId type quantityChange balanceBefore balanceAfter reason actorName
      }
    }`, { input })
  }

  async function graphql(token: string, query: string, variables?: Record<string, unknown>) {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('origin', 'http://localhost:5173')
      .set('authorization', `Bearer ${token}`)
      .set('x-tenant-id', tenantId)
      .send({ query, variables })
  }
})
