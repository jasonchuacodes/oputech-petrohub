import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { hash } from 'argon2'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import request from 'supertest'
import { configureApplication } from '../../../src/configure-application'
import { FuelSetupService } from '../../../src/modules/fuel-setup/fuel-setup.service'
import { FuelProductColor } from '../../../src/modules/fuel-setup/schemas/fuel-product.schema'
import { TenantService } from '../../../src/modules/tenants/tenant.service'
import { UserRole } from '../../../src/modules/users/schemas/user.schema'
import { UsersService } from '../../../src/modules/users/users.service'

describe('fuel setup pump readings', () => {
  let replicaSet: MongoMemoryReplSet
  let app: INestApplication
  let tenantId: string
  let meterId: string
  let productId: string
  let shiftId: string

  beforeAll(async () => {
    replicaSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
    process.env.NODE_ENV = 'test'
    process.env.MONGODB_URI = replicaSet.getUri('petromate-fuel-setup-test')
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
    const setup = app.get(FuelSetupService)
    const owner = await users.create({
      username: 'fuel-setup-owner',
      passwordHash: await hash('OwnerPassword123'),
      role: UserRole.SUPERADMIN,
    })
    const tenant = await tenants.create(owner._id, { name: 'Fuel Setup Station' })
    tenantId = tenant._id.toHexString()
    await users.create({
      username: 'fuel-setup-admin',
      passwordHash: await hash('AdminPassword123'),
      role: UserRole.ADMIN,
      accountHolderId: owner._id,
      tenantIds: [tenant._id],
    })
    await users.create({
      username: 'fuel-setup-member',
      passwordHash: await hash('MemberPassword123'),
      role: UserRole.MEMBER,
      accountHolderId: owner._id,
      tenantIds: [tenant._id],
    })
    await users.create({
      username: 'fuel-setup-member-two',
      passwordHash: await hash('MemberTwoPassword123'),
      role: UserRole.MEMBER,
      accountHolderId: owner._id,
      tenantIds: [tenant._id],
    })
    const shift = await tenants.createShift(tenant._id, { name: 'Day', startTime: '06:00', endTime: '18:00' })
    shiftId = shift.id.toHexString()
    const product = await setup.createProduct(tenant._id, { name: 'ADO', color: FuelProductColor.GRAY, unitPrice: '10.00' })
    productId = product._id.toHexString()
    const meter = await setup.createMeter(tenant._id, {
      label: 'ADO 1',
      productId: product._id,
      initialReading: '100.000',
    })
    meterId = meter._id.toHexString()
  }, 60_000)

  afterAll(async () => {
    await app?.close()
    await replicaSet?.stop()
  })

  it('uses an overridden current reading for new reports without changing existing snapshots', async () => {
    const token = await login('fuel-setup-admin', 'AdminPassword123')
    const initial = await fuelSetup(token)
    const meter = initial.body.data.fuelSetup.meters.find((item: { id: string }) => item.id === meterId)
    expect(meter).toMatchObject({ currentReading: '100', revision: 0 })

    const overridden = await updateMeter(token, {
      meterId,
      expectedRevision: meter.revision,
      label: meter.label,
      currentReading: '125.125',
      expectedCurrentReading: meter.currentReading,
    })
    expect(overridden.body.errors).toBeUndefined()
    expect(overridden.body.data.updatePumpMeter).toMatchObject({ currentReading: '125.125', revision: 1 })

    const stale = await updateMeter(token, {
      meterId,
      expectedRevision: 1,
      label: meter.label,
      currentReading: '130.000',
      expectedCurrentReading: '100.000',
    })
    expect(stale.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'CONFLICT' })

    const context = await graphql(token, `query {
      reportCreationContext {
        businessDate
        slots { id shift { id } }
      }
    }`)
    expect(context.body.errors).toBeUndefined()
    const slot = context.body.data.reportCreationContext.slots.find((item: { shift: { id: string } }) => item.shift.id === shiftId)
    const created = await graphql(token, `mutation ($input: CreateReportInput!) {
      createReport(input: $input) {
        report { id disposals { readings { meterId openingReading } } }
      }
    }`, { input: { slotId: slot.id, businessDate: context.body.data.reportCreationContext.businessDate } })
    expect(created.body.errors).toBeUndefined()
    const report = created.body.data.createReport.report
    expect(report.disposals.readings).toContainEqual({ meterId, openingReading: '125.125' })

    const changedAgain = await updateMeter(token, {
      meterId,
      expectedRevision: 1,
      label: meter.label,
      currentReading: '130.000',
      expectedCurrentReading: '125.125',
    })
    expect(changedAgain.body.errors).toBeUndefined()
    expect(changedAgain.body.data.updatePumpMeter.currentReading).toBe('130')

    const existingReport = await graphql(token, `query ($input: ReportInput!) {
      report(input: $input) { disposals { readings { meterId openingReading } } }
    }`, { input: { reportId: report.id } })
    expect(existingReport.body.errors).toBeUndefined()
    expect(existingReport.body.data.report.disposals.readings).toContainEqual({ meterId, openingReading: '125.125' })
    const latest = await fuelSetup(token)
    expect(latest.body.data.fuelSetup.meters.find((item: { id: string }) => item.id === meterId).currentReading).toBe('130')
  })

  it('creates and updates a fuel product color', async () => {
    const token = await login('fuel-setup-admin', 'AdminPassword123')
    const created = await graphql(token, `mutation ($input: CreateFuelProductInput!) {
      createFuelProduct(input: $input) { id name color revision }
    }`, { input: { name: 'Premium', color: 'orange', unitPrice: '65.00' } })
    expect(created.body.errors).toBeUndefined()
    expect(created.body.data.createFuelProduct).toMatchObject({ name: 'Premium', color: 'orange', revision: 0 })

    const product = created.body.data.createFuelProduct
    const updated = await graphql(token, `mutation ($input: UpdateFuelProductInput!) {
      updateFuelProduct(input: $input) { id name color revision }
    }`, {
      input: {
        productId: product.id,
        expectedRevision: product.revision,
        name: product.name,
        color: 'red',
      },
    })
    expect(updated.body.errors).toBeUndefined()
    expect(updated.body.data.updateFuelProduct).toMatchObject({ id: product.id, color: 'red', revision: 1 })
  })

  it('lets members record delivery readings and recalculates the current tank reading after deletion', async () => {
    const adminToken = await login('fuel-setup-admin', 'AdminPassword123')
    const memberToken = await login('fuel-setup-member', 'MemberPassword123')
    const otherMemberToken = await login('fuel-setup-member-two', 'MemberTwoPassword123')
    const tankResult = await graphql(adminToken, `mutation ($input: CreateFuelTankInput!) {
      createFuelTank(input: $input) { id label productId currentReading revision }
    }`, { input: { label: 'Tank 1', productId } })
    expect(tankResult.body.errors).toBeUndefined()
    const tank = tankResult.body.data.createFuelTank
    expect(tank).toMatchObject({ label: 'Tank 1', productId, currentReading: null, revision: 0 })

    const deactivated = await graphql(adminToken, `mutation ($input: DeactivateFuelSetupInput!) {
      deactivateFuelTank(input: $input) { id status revision }
    }`, { input: { id: tank.id, expectedRevision: tank.revision } })
    expect(deactivated.body.errors).toBeUndefined()
    expect(deactivated.body.data.deactivateFuelTank).toMatchObject({ status: 'inactive', revision: 1 })

    const activated = await graphql(adminToken, `mutation ($input: DeactivateFuelSetupInput!) {
      activateFuelTank(input: $input) { id status revision }
    }`, { input: { id: tank.id, expectedRevision: 1 } })
    expect(activated.body.errors).toBeUndefined()
    expect(activated.body.data.activateFuelTank).toMatchObject({ status: 'active', revision: 2 })

    const forbidden = await graphql(memberToken, `mutation ($input: CreateFuelTankInput!) {
      createFuelTank(input: $input) { id }
    }`, { input: { label: 'Member tank', productId } })
    expect(forbidden.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'FORBIDDEN' })

    const created = await graphql(memberToken, `mutation ($input: CreateFuelDeliveryInput!) {
      createFuelDelivery(input: $input) { id deliveryDate createdByName canManage revision readings { tankId beforeReading afterReading } }
    }`, {
      input: {
        deliveryDate: '2026-11-15',
        lines: [{ productId, quantity: '2000' }],
        readings: [{ tankId: tank.id, beforeReading: '100', afterReading: '581' }],
        notes: 'Delivery completed',
        idempotencyKey: 'fuel-delivery-member-1',
      },
    })
    expect(created.body.errors).toBeUndefined()
    expect(created.body.data.createFuelDelivery).toMatchObject({
      deliveryDate: '2026-11-15',
      createdByName: 'fuel-setup-member',
      canManage: true,
      revision: 0,
      readings: [{ tankId: tank.id, beforeReading: '100', afterReading: '581' }],
    })

    const afterCreate = await graphql(memberToken, `query { fuelSetup { tanks { id currentReading lastReadingDate } } }`)
    expect(afterCreate.body.data.fuelSetup.tanks.find((item: { id: string }) => item.id === tank.id)).toMatchObject({ currentReading: '581', lastReadingDate: '2026-11-15' })

    const delivery = created.body.data.createFuelDelivery
    const otherMemberHistory = await graphql(otherMemberToken, `query ($input: FuelDeliveriesInput!) {
      fuelDeliveries(input: $input) { items { id canManage } }
    }`, { input: { offset: 0, limit: 100 } })
    expect(otherMemberHistory.body.errors).toBeUndefined()
    expect(otherMemberHistory.body.data.fuelDeliveries.items.find((item: { id: string }) => item.id === delivery.id)).toMatchObject({ canManage: false })

    const forbiddenUpdate = await updateDelivery(otherMemberToken, {
      deliveryId: delivery.id,
      expectedRevision: delivery.revision,
      deliveryDate: '2026-11-15',
      lines: [{ productId, quantity: '2000' }],
      readings: [{ tankId: tank.id, beforeReading: '100', afterReading: '581' }],
      notes: 'Unauthorized edit',
    })
    expect(forbiddenUpdate.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'FORBIDDEN' })

    const forbiddenDelete = await deleteDelivery(otherMemberToken, delivery.id, delivery.revision)
    expect(forbiddenDelete.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'FORBIDDEN' })

    const adminUpdate = await updateDelivery(adminToken, {
      deliveryId: delivery.id,
      expectedRevision: delivery.revision,
      deliveryDate: '2026-11-15',
      lines: [{ productId, quantity: '2000' }],
      readings: [{ tankId: tank.id, beforeReading: '100', afterReading: '581' }],
      notes: 'Admin reviewed',
    })
    expect(adminUpdate.body.errors).toBeUndefined()
    expect(adminUpdate.body.data.updateFuelDelivery).toMatchObject({ revision: 1, updatedByName: 'fuel-setup-admin', canManage: true })

    const deleted = await deleteDelivery(memberToken, delivery.id, 1)
    expect(deleted.body.errors).toBeUndefined()
    expect(deleted.body.data.deleteFuelDelivery.revision).toBe(2)

    const afterDelete = await graphql(memberToken, `query { fuelSetup { tanks { id currentReading lastReadingDate } } }`)
    expect(afterDelete.body.data.fuelSetup.tanks.find((item: { id: string }) => item.id === tank.id)).toMatchObject({ currentReading: null, lastReadingDate: null })
  })

  it('records current tank reading overrides in history', async () => {
    const token = await login('fuel-setup-admin', 'AdminPassword123')
    const created = await graphql(token, `mutation ($input: CreateFuelTankInput!) {
      createFuelTank(input: $input) { id label currentReading revision }
    }`, { input: { label: 'Override tank', productId } })
    expect(created.body.errors).toBeUndefined()
    const tank = created.body.data.createFuelTank

    const initialOverride = await updateTank(token, {
      tankId: tank.id,
      expectedRevision: tank.revision,
      label: tank.label,
      currentReading: '500.125',
      expectedCurrentReading: null,
    })
    expect(initialOverride.body.errors).toBeUndefined()
    expect(initialOverride.body.data.updateFuelTank).toMatchObject({ currentReading: '500.125', revision: 1 })

    const lowerOverride = await updateTank(token, {
      tankId: tank.id,
      expectedRevision: 1,
      label: tank.label,
      currentReading: '450',
      expectedCurrentReading: '500.125',
    })
    expect(lowerOverride.body.errors).toBeUndefined()
    expect(lowerOverride.body.data.updateFuelTank).toMatchObject({ currentReading: '450', revision: 2 })

    const history = await tankReadingHistory(token, tank.id)
    expect(history).toHaveLength(2)
    expect(history[0]).toMatchObject({
      eventType: 'manual_override',
      createdByName: 'fuel-setup-admin',
      lines: [],
      readings: [{ tankId: tank.id, beforeReading: '500.125', afterReading: '450' }],
    })
    expect(history[1]).toMatchObject({
      eventType: 'manual_override',
      readings: [{ tankId: tank.id, beforeReading: null, afterReading: '500.125' }],
    })

    const stale = await updateTank(token, {
      tankId: tank.id,
      expectedRevision: 2,
      label: tank.label,
      currentReading: '475',
      expectedCurrentReading: '500.125',
    })
    expect(stale.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'CONFLICT' })

    const renamed = await updateTank(token, {
      tankId: tank.id,
      expectedRevision: 2,
      label: 'Renamed override tank',
      currentReading: '450',
      expectedCurrentReading: '450',
    })
    expect(renamed.body.errors).toBeUndefined()
    expect(renamed.body.data.updateFuelTank).toMatchObject({ label: 'Renamed override tank', currentReading: '450', revision: 3 })
    expect(await tankReadingHistory(token, tank.id)).toHaveLength(2)
  })

  async function login(username: string, password: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username, password })
      .expect(200)
    return response.body.accessToken as string
  }

  async function graphql(token: string, query: string, variables?: Record<string, unknown>) {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('origin', 'http://localhost:5173')
      .set('authorization', `Bearer ${token}`)
      .set('x-tenant-id', tenantId)
      .send({ query, variables })
  }

  async function fuelSetup(token: string) {
    return graphql(token, `query { fuelSetup { meters { id label currentReading revision } } }`)
  }

  async function updateMeter(token: string, input: Record<string, unknown>) {
    return graphql(token, `mutation ($input: UpdatePumpMeterInput!) {
      updatePumpMeter(input: $input) { id label currentReading revision }
    }`, { input })
  }

  async function updateTank(token: string, input: Record<string, unknown>) {
    return graphql(token, `mutation ($input: UpdateFuelTankInput!) {
      updateFuelTank(input: $input) { id label currentReading revision }
    }`, { input })
  }

  async function updateDelivery(token: string, input: Record<string, unknown>) {
    return graphql(token, `mutation ($input: UpdateFuelDeliveryInput!) {
      updateFuelDelivery(input: $input) { id revision updatedByName canManage }
    }`, { input })
  }

  async function deleteDelivery(token: string, deliveryId: string, expectedRevision: number) {
    return graphql(token, `mutation ($input: DeleteFuelDeliveryInput!) {
      deleteFuelDelivery(input: $input) { id revision }
    }`, { input: { deliveryId, expectedRevision } })
  }

  async function tankReadingHistory(token: string, tankId: string) {
    const response = await graphql(token, `query ($input: FuelDeliveriesInput!) {
      fuelDeliveries(input: $input) {
        items {
          eventType
          createdByName
          lines { productId }
          readings { tankId beforeReading afterReading }
        }
      }
    }`, { input: { offset: 0, limit: 100 } })
    expect(response.body.errors).toBeUndefined()
    return response.body.data.fuelDeliveries.items.filter((item: { readings: Array<{ tankId: string }> }) =>
      item.readings.some((reading) => reading.tankId === tankId),
    )
  }
})
