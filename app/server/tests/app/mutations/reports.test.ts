import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { hash } from 'argon2'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import request from 'supertest'
import { configureApplication } from '../../../src/configure-application'
import { FuelSetupService } from '../../../src/modules/fuel-setup/fuel-setup.service'
import { InventoryService } from '../../../src/modules/inventory/inventory.service'
import { TenantService } from '../../../src/modules/tenants/tenant.service'
import { UserRole } from '../../../src/modules/users/schemas/user.schema'
import { UsersService } from '../../../src/modules/users/users.service'

describe('report disposal lifecycle', () => {
  let replicaSet: MongoMemoryReplSet
  let app: INestApplication
  let tenantId: string
  let firstShiftId: string
  let secondShiftId: string
  let lubricantProductId: string

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
    const inventory = app.get(InventoryService)
    const owner = await users.create({ username: 'report-owner', passwordHash: await hash('OwnerPassword123'), role: UserRole.SUPERADMIN })
    const tenant = await tenants.create(owner._id, { name: 'Report Station' })
    tenantId = tenant._id.toHexString()
    await users.create({ username: 'report-admin', passwordHash: await hash('AdminPassword123'), role: UserRole.ADMIN, accountHolderId: owner._id, tenantIds: [tenant._id] })
    await users.create({ username: 'report-member', passwordHash: await hash('MemberPassword123'), role: UserRole.MEMBER, accountHolderId: owner._id, tenantIds: [tenant._id] })
    await users.create({ username: 'report-other-member', passwordHash: await hash('OtherMemberPassword123'), role: UserRole.MEMBER, accountHolderId: owner._id, tenantIds: [tenant._id] })
    const first = await tenants.createShift(tenant._id, { startTime: '05:00', endTime: '13:00' })
    const second = await tenants.createShift(tenant._id, { startTime: '13:00', endTime: '21:00' })
    firstShiftId = first.id.toHexString()
    secondShiftId = second.id.toHexString()
    const product = await setup.createProduct(tenant._id, { name: 'ADO', unitPrice: '10.00' })
    await setup.createMeter(tenant._id, { label: 'ADO 1', productId: product._id, initialReading: '100.000' })
    const lubricant = await inventory.createProduct(
      tenant._id,
      { userId: owner._id, name: owner.username },
      { name: 'Engine Oil 1L', unit: 'bottle', unitPrice: '125.00', openingStock: '1', idempotencyKey: 'test-opening-engine-oil' },
    )
    lubricantProductId = lubricant._id.toHexString()
  }, 60_000)

  afterAll(async () => {
    await app?.close()
    await replicaSet?.stop()
  })

  it('blocks predecessor deletion, then rolls the latest submitted reading back for normal recreation', async () => {
    const memberToken = await login('report-member', 'MemberPassword123')
    const otherMemberToken = await login('report-other-member', 'OtherMemberPassword123')
    const adminToken = await login('report-admin', 'AdminPassword123')
    const superadminToken = await login('report-owner', 'OwnerPassword123')
    const context = await graphql(memberToken, `query { reportCreationContext { businessDate } }`)
    const businessDate = context.body.data.reportCreationContext.businessDate as string

    const first = await createReport(memberToken, firstShiftId, businessDate)
    const reportsInRange = await graphql(adminToken, `query ($input: ReportsInput!) { reports(input: $input) { items { id businessDate } totalCount } }`, {
      input: { startDate: businessDate, endDate: businessDate, offset: 0, limit: 20 },
    })
    expect(reportsInRange.body.errors).toBeUndefined()
    expect(reportsInRange.body.data.reports).toEqual({
      items: [{ id: first.id, businessDate }],
      totalCount: 1,
    })

    const submittedDraftsExcluded = await graphql(adminToken, `query ($input: ReportsInput!) { reports(input: $input) { items { id } totalCount } }`, {
      input: { startDate: businessDate, endDate: businessDate, submittedOnly: true, offset: 0 },
    })
    expect(submittedDraftsExcluded.body.errors).toBeUndefined()
    expect(submittedDraftsExcluded.body.data.reports).toEqual({ items: [], totalCount: 0 })

    const reportsOutsideRange = await graphql(adminToken, `query ($input: ReportsInput!) { reports(input: $input) { items { id } totalCount } }`, {
      input: { startDate: '1900-01-01', endDate: '1900-01-31', offset: 0, limit: 20 },
    })
    expect(reportsOutsideRange.body.errors).toBeUndefined()
    expect(reportsOutsideRange.body.data.reports).toEqual({ items: [], totalCount: 0 })

    const incompleteRange = await graphql(adminToken, `query ($input: ReportsInput!) { reports(input: $input) { totalCount } }`, {
      input: { startDate: businessDate, offset: 0, limit: 20 },
    })
    expect(incompleteRange.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'INVALID_INPUT' })

    const reversedRange = await graphql(adminToken, `query ($input: ReportsInput!) { reports(input: $input) { totalCount } }`, {
      input: { startDate: '2026-02-01', endDate: '2026-01-01', offset: 0, limit: 20 },
    })
    expect(reversedRange.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'INVALID_INPUT' })

    const firstSaved = await saveReport(memberToken, first.id, first.revision, first.disposals.revision, '110.000')
    const firstSubmitted = await transition(memberToken, 'submitReport', firstSaved.id, firstSaved.revision, firstSaved.disposals.revision)
    expect(firstSubmitted.totals).toMatchObject({ cashFuelSales: '1100', pumpSales: '80', overShort: '1020' })
    expect(firstSubmitted.totals.lubricantSales).toBe('375')

    const submittedReports = await graphql(adminToken, `query ($input: ReportsInput!) { reports(input: $input) { items { id effective status totals { cashFuelSales pumpSales overShort lubricantSales } } totalCount } }`, {
      input: { startDate: businessDate, endDate: businessDate, submittedOnly: true, offset: 0 },
    })
    expect(submittedReports.body.errors).toBeUndefined()
    expect(submittedReports.body.data.reports).toEqual({
      items: [{
        id: first.id,
        effective: true,
        status: 'submitted',
        totals: { cashFuelSales: '1100', pumpSales: '80', overShort: '1020', lubricantSales: '375' },
      }],
      totalCount: 1,
    })
    expect((await inventoryProducts(memberToken)).items.find((item: { id: string }) => item.id === lubricantProductId)).toMatchObject({ id: lubricantProductId, stockCount: '-2' })

    const second = await createReport(memberToken, secondShiftId, businessDate)
    expect(second.disposals.readings[0].openingReading).toBe('110')

    const blocked = await deleteReport(adminToken, firstSubmitted, 'Incorrect first report')
    expect(blocked.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'CONFLICT' })

    const forbidden = await deleteReport(otherMemberToken, second, 'Remove another user report')
    expect(forbidden.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'FORBIDDEN' })

    const secondDeleted = await deleteReport(memberToken, second, 'Remove dependent draft')
    expect(secondDeleted.body.errors).toBeUndefined()
    expect(secondDeleted.body.data.deleteReport.status).toBe('revoked')

    const latestFirst = await reportDetail(adminToken, firstSubmitted.id)
    const firstDeleted = await deleteReport(adminToken, latestFirst, 'Incorrect submitted readings')
    expect(firstDeleted.body.errors).toBeUndefined()
    expect(firstDeleted.body.data.deleteReport).toMatchObject({ status: 'revoked', effective: false, revokedFromStatus: 'submitted' })
    expect((await inventoryProducts(memberToken)).items.find((item: { id: string }) => item.id === lubricantProductId)?.stockCount).toBe('1')
    const stockHistory = await graphql(memberToken, `query ($input: StockMovementsInput!) { stockMovements(input: $input) { items { type quantityChange balanceBefore balanceAfter } } }`, { input: { productId: lubricantProductId, offset: 0, limit: 20 } })
    expect(stockHistory.body.errors).toBeUndefined()
    expect(stockHistory.body.data.stockMovements.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'report_sale', quantityChange: '-3', balanceAfter: '-2' }),
      expect.objectContaining({ type: 'report_reversal', quantityChange: '3', balanceAfter: '1' }),
    ]))

    const negativeManual = await graphql(adminToken, `mutation ($input: RecordStockMovementInput!) { recordStockMovement(input: $input) { type quantityChange balanceAfter } }`, { input: { productId: lubricantProductId, type: 'stock_out', quantity: '5', reason: 'Damaged stock correction', idempotencyKey: 'test-manual-negative-stock' } })
    expect(negativeManual.body.errors).toBeUndefined()
    expect(negativeManual.body.data.recordStockMovement).toEqual({ type: 'stock_out', quantityChange: '-5', balanceAfter: '-4' })
    const forbiddenMovement = await graphql(memberToken, `mutation ($input: RecordStockMovementInput!) { recordStockMovement(input: $input) { id } }`, { input: { productId: lubricantProductId, type: 'stock_in', quantity: '1', reason: 'Unauthorized change', idempotencyKey: 'test-forbidden-stock-change' } })
    expect(forbiddenMovement.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'FORBIDDEN' })

    const productInput = { name: 'Transmission Fluid', unit: 'bottle', unitPrice: '95.00', openingStock: '-3', idempotencyKey: 'test-negative-opening-stock' }
    const createdProduct = await graphql(adminToken, `mutation ($input: CreateInventoryProductInput!) { createInventoryProduct(input: $input) { id name stockCount unitPrice unit } }`, { input: productInput })
    expect(createdProduct.body.errors).toBeUndefined()
    expect(createdProduct.body.data.createInventoryProduct).toMatchObject({ name: 'Transmission Fluid', stockCount: '-3', unitPrice: '95', unit: 'bottle' })
    const retriedProduct = await graphql(adminToken, `mutation ($input: CreateInventoryProductInput!) { createInventoryProduct(input: $input) { id } }`, { input: productInput })
    expect(retriedProduct.body.errors).toBeUndefined()
    expect(retriedProduct.body.data.createInventoryProduct.id).toBe(createdProduct.body.data.createInventoryProduct.id)

    const memberConfiguration = await graphql(memberToken, `query { recurringIncomeConfiguration { revision } }`)
    expect(memberConfiguration.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'FORBIDDEN' })

    const configuration = await graphql(adminToken, `query { recurringIncomeConfiguration { revision fields { id description active } } }`)
    expect(configuration.body.errors).toBeUndefined()
    const configured = await graphql(adminToken, `mutation ($input: UpdateRecurringIncomeConfigurationInput!) { updateRecurringIncomeConfiguration(input: $input) { revision fields { id description active } } }`, {
      input: {
        expectedRevision: configuration.body.data.recurringIncomeConfiguration.revision,
        fields: [{ id: null, description: 'PayMaya', active: true }],
      },
    })
    expect(configured.body.errors).toBeUndefined()

    const recreated = await createReport(memberToken, firstShiftId, businessDate)
    expect(recreated.id).not.toBe(first.id)
    expect(recreated.disposals.readings[0]).toMatchObject({ openingReading: '100', openingSource: 'baseline' })
    expect(recreated.incomeEntries).toEqual([
      expect.objectContaining({
        recurringIncomeFieldId: configured.body.data.updateRecurringIncomeConfiguration.fields[0].id,
        description: 'PayMaya',
        amount: '0',
      }),
    ])

    const recurringEntry = recreated.incomeEntries[0]
    const recurringSaved = await graphql(memberToken, `mutation ($input: SaveReportDraftInput!) { saveReportDraft(input: $input) { ${detailFields} } }`, {
      input: {
        reportId: recreated.id,
        expectedReportRevision: recreated.revision,
        expectedDisposalRevision: recreated.disposals.revision,
        incomeEntries: [{ id: recurringEntry.id, description: recurringEntry.description, notes: null, amount: '0.00' }],
        expenseEntries: [],
        disposalReadings: [{ meterId: recreated.disposals.readings[0].meterId, closingReading: '101.000', calibration: '0.000' }],
      },
    })
    expect(recurringSaved.body.errors).toBeUndefined()
    expect(recurringSaved.body.data.saveReportDraft.incomeEntries[0]).toMatchObject({ amount: '0', recurringIncomeFieldId: recurringEntry.recurringIncomeFieldId })

    const protectedRemoval = await graphql(memberToken, `mutation ($input: SaveReportDraftInput!) { saveReportDraft(input: $input) { id } }`, {
      input: {
        reportId: recreated.id,
        expectedReportRevision: recurringSaved.body.data.saveReportDraft.revision,
        expectedDisposalRevision: recurringSaved.body.data.saveReportDraft.disposals.revision,
        incomeEntries: [],
        expenseEntries: [],
        disposalReadings: [{ meterId: recreated.disposals.readings[0].meterId, closingReading: '101.000', calibration: '0.000' }],
      },
    })
    expect(protectedRemoval.body.errors?.[0]?.extensions?.originalError).toMatchObject({ code: 'INVALID_INPUT' })

    const archived = await graphql(adminToken, `mutation ($input: UpdateRecurringIncomeConfigurationInput!) { updateRecurringIncomeConfiguration(input: $input) { fields { id active } } }`, {
      input: {
        expectedRevision: configured.body.data.updateRecurringIncomeConfiguration.revision,
        fields: [{ id: recurringEntry.recurringIncomeFieldId, description: recurringEntry.description, active: false }],
      },
    })
    expect(archived.body.errors).toBeUndefined()
    expect(archived.body.data.updateRecurringIncomeConfiguration.fields[0]).toMatchObject({ id: recurringEntry.recurringIncomeFieldId, active: false })
    expect((await reportDetail(memberToken, recreated.id)).incomeEntries[0]).toMatchObject({ recurringIncomeFieldId: recurringEntry.recurringIncomeFieldId, description: 'PayMaya' })

    const superadminDeleted = await deleteReport(superadminToken, recurringSaved.body.data.saveReportDraft, 'Superadmin correction')
    expect(superadminDeleted.body.errors).toBeUndefined()
    expect(superadminDeleted.body.data.deleteReport.status).toBe('revoked')
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
        expenseEntries: [{ id: 'expense-1', description: 'Cash expense', notes: null, amount: '100.00' }],
        lubricantSales: [{ id: 'lube-1', productId: lubricantProductId, quantity: '3' }],
        disposalReadings: [{ meterId: (await reportDetail(token, reportId)).disposals.readings[0].meterId, closingReading, calibration: '2.000' }],
      },
    })
    expect(response.body.errors).toBeUndefined()
    return response.body.data.saveReportDraft
  }

  async function inventoryProducts(token: string) {
    const response = await graphql(token, `query ($input: InventoryProductsInput!) { inventoryProducts(input: $input) { items { id stockCount } } }`, { input: { search: '', activeOnly: false, offset: 0, limit: 20 } })
    expect(response.body.errors).toBeUndefined()
    return response.body.data.inventoryProducts
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
  incomeEntries { id recurringIncomeFieldId description notes amount }
  lubricantSales { id productId productName unit quantity unitPrice amount }
  totals { cashFuelSales pumpSales overShort lubricantSales }
  disposals {
    revision status
    readings { meterId openingReading openingSource closingReading calibration netVolume sales }
  }
`
