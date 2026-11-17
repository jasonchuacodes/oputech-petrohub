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
    const shift = await tenants.createShift(tenant._id, { name: 'Day', startTime: '06:00', endTime: '18:00' })
    shiftId = shift.id.toHexString()
    const product = await setup.createProduct(tenant._id, { name: 'ADO', color: FuelProductColor.GRAY, unitPrice: '10.00' })
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
})
