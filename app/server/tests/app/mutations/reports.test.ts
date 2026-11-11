import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { hash } from 'argon2'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import request from 'supertest'
import { configureApplication } from '../../../src/configure-application'
import { FuelSetupService } from '../../../src/modules/fuel-setup/fuel-setup.service'
import { TenantService } from '../../../src/modules/tenants/tenant.service'
import { UserRole } from '../../../src/modules/users/schemas/user.schema'
import { UsersService } from '../../../src/modules/users/users.service'

describe('report disposal lifecycle', () => {
  let replicaSet: MongoMemoryReplSet
  let app: INestApplication
  let tenantId: string
  let firstShiftId: string
  let secondShiftId: string

  beforeAll(async () => {
    replicaSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
    process.env.NODE_ENV = 'test'
    process.env.MONGODB_URI = replicaSet.getUri('petromate-reports-test')
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
    const owner = await users.create({ username: 'report-owner', passwordHash: await hash('OwnerPassword123'), role: UserRole.SUPERADMIN })
    const tenant = await tenants.create(owner._id, { name: 'Report Station' })
    tenantId = tenant._id.toHexString()
    await users.create({ username: 'report-admin', passwordHash: await hash('AdminPassword123'), role: UserRole.ADMIN, accountHolderId: owner._id, tenantIds: [tenant._id] })
    await users.create({ username: 'report-member', passwordHash: await hash('MemberPassword123'), role: UserRole.MEMBER, accountHolderId: owner._id, tenantIds: [tenant._id] })
    const first = await tenants.createShift(tenant._id, { startTime: '05:00', endTime: '13:00' })
    const second = await tenants.createShift(tenant._id, { startTime: '13:00', endTime: '21:00' })
    firstShiftId = first.id.toHexString()
    secondShiftId = second.id.toHexString()
    const product = await setup.createProduct(tenant._id, { name: 'ADO', unitPrice: '10.00' })
    await setup.createMeter(tenant._id, { label: 'ADO 1', productId: product._id, initialReading: '100.000' })
  }, 60_000)

  afterAll(async () => {
    await app?.close()
    await replicaSet?.stop()
  })

  it('blocks predecessor deletion, then rolls the latest submitted reading back for normal recreation', async () => {
    const memberToken = await login('report-member', 'MemberPassword123')
    const adminToken = await login('report-admin', 'AdminPassword123')
    const context = await graphql(memberToken, `query { reportCreationContext { businessDate } }`)
    const businessDate = context.body.data.reportCreationContext.businessDate as string

    const first = await createReport(memberToken, firstShiftId, businessDate)
    const firstSaved = await saveReport(memberToken, first.id, first.revision, first.disposals.revision, '110.000')
    const firstSubmitted = await transition(memberToken, 'submitReport', firstSaved.id, firstSaved.revision, firstSaved.disposals.revision)
    expect(firstSubmitted.totals).toMatchObject({ cashFuelSales: '1000', pumpSales: '80', overShort: '920' })

    const second = await createReport(memberToken, secondShiftId, businessDate)
    expect(second.disposals.readings[0].openingReading).toBe('110')

    const blocked = await deleteReport(adminToken, firstSubmitted, 'Incorrect first report')
    expect(blocked.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'CONFLICT' })

    const secondDeleted = await deleteReport(adminToken, second, 'Remove dependent draft')
    expect(secondDeleted.body.errors).toBeUndefined()
    expect(secondDeleted.body.data.deleteReport.status).toBe('revoked')

    const latestFirst = await reportDetail(adminToken, firstSubmitted.id)
    const firstDeleted = await deleteReport(adminToken, latestFirst, 'Incorrect submitted readings')
    expect(firstDeleted.body.errors).toBeUndefined()
    expect(firstDeleted.body.data.deleteReport).toMatchObject({ status: 'revoked', effective: false, revokedFromStatus: 'submitted' })

    const recreated = await createReport(memberToken, firstShiftId, businessDate)
    expect(recreated.id).not.toBe(first.id)
    expect(recreated.disposals.readings[0]).toMatchObject({ openingReading: '100', openingSource: 'baseline' })
  })

  async function login(username: string, password: string): Promise<string> {
    const response = await request(app.getHttpServer()).post('/api/auth/session').set('origin', 'http://localhost:5173').send({ username, password }).expect(200)
    return response.body.accessToken as string
  }

  async function graphql(token: string, query: string, variables?: Record<string, unknown>) {
    return request(app.getHttpServer()).post('/graphql').set('origin', 'http://localhost:5173').set('authorization', `Bearer ${token}`).set('x-tenant-id', tenantId).send({ query, variables })
  }

  async function createReport(token: string, shiftId: string, businessDate: string) {
    const response = await graphql(token, `mutation ($input: CreateReportInput!) { createReport(input: $input) { report { ${detailFields} } } }`, { input: { shiftId, businessDate } })
    expect(response.body.errors).toBeUndefined()
    return response.body.data.createReport.report
  }

  async function saveReport(token: string, reportId: string, expectedReportRevision: number, expectedDisposalRevision: number, closingReading: string) {
    const response = await graphql(token, `mutation ($input: SaveReportDraftInput!) { saveReportDraft(input: $input) { ${detailFields} } }`, {
      input: {
        reportId,
        expectedReportRevision,
        expectedDisposalRevision,
        incomeEntries: [{ id: 'income-1', description: 'Cash received', notes: null, amount: '1000.00' }],
        expenseEntries: [],
        disposalReadings: [{ meterId: (await reportDetail(token, reportId)).disposals.readings[0].meterId, closingReading, calibration: '2.000' }],
      },
    })
    expect(response.body.errors).toBeUndefined()
    return response.body.data.saveReportDraft
  }

  async function reportDetail(token: string, reportId: string) {
    const response = await graphql(token, `query ($input: ReportInput!) { report(input: $input) { ${detailFields} } }`, { input: { reportId } })
    expect(response.body.errors).toBeUndefined()
    return response.body.data.report
  }

  async function transition(token: string, field: 'submitReport', reportId: string, expectedReportRevision: number, expectedDisposalRevision: number) {
    const response = await graphql(token, `mutation ($input: ReportTransitionInput!) { ${field}(input: $input) { ${detailFields} } }`, { input: { reportId, expectedReportRevision, expectedDisposalRevision } })
    expect(response.body.errors).toBeUndefined()
    return response.body.data[field]
  }

  async function deleteReport(token: string, report: { id: string; revision: number; disposals: { revision: number } }, reason: string) {
    return graphql(token, `mutation ($input: DeleteReportInput!) { deleteReport(input: $input) { ${detailFields} } }`, { input: { reportId: report.id, expectedReportRevision: report.revision, expectedDisposalRevision: report.disposals.revision, reason } })
  }
})

const detailFields = `
  id status effective revision revokedFromStatus
  totals { cashFuelSales pumpSales overShort }
  disposals {
    revision status
    readings { meterId openingReading openingSource closingReading calibration netVolume sales }
  }
`
