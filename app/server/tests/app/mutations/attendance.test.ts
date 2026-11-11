import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { getModelToken } from '@nestjs/mongoose'
import { hash } from 'argon2'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { Model, Types } from 'mongoose'
import request from 'supertest'
import { configureApplication } from '../../../src/configure-application'
import { addLocalDays, currentWeek, startOfLocalDate } from '../../../src/modules/attendance/attendance-date'
import { AttendanceSession } from '../../../src/modules/attendance/schemas/attendance-session.schema'
import { TenantService } from '../../../src/modules/tenants/tenant.service'
import { UserRole } from '../../../src/modules/users/schemas/user.schema'
import { UsersService } from '../../../src/modules/users/users.service'

describe('attendance and timesheets', () => {
  let replicaSet: MongoMemoryReplSet
  let app: INestApplication
  let tenantId: string
  let memberId: string

  beforeAll(async () => {
    replicaSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
    process.env.NODE_ENV = 'test'
    process.env.MONGODB_URI = replicaSet.getUri('petromate-attendance-test')
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
      username: 'attendance-owner',
      passwordHash: await hash('OwnerPassword123'),
      role: UserRole.SUPERADMIN,
    })
    const tenant = await tenants.create(owner._id, { name: 'Attendance Station' })
    tenantId = tenant._id.toHexString()
    await users.create({
      username: 'attendance-admin',
      passwordHash: await hash('AdminPassword123'),
      role: UserRole.ADMIN,
      accountHolderId: owner._id,
      tenantIds: [tenant._id],
    })
    const member = await users.create({
      username: 'attendance-member',
      passwordHash: await hash('MemberPassword123'),
      role: UserRole.MEMBER,
      accountHolderId: owner._id,
      tenantIds: [tenant._id],
    })
    memberId = member._id.toHexString()
  }, 60_000)

  afterAll(async () => {
    await app?.close()
    await replicaSet?.stop()
  })

  it('persists member clock transitions and safely retries them', async () => {
    const token = await login('attendance-member', 'MemberPassword123')
    const key = '6ca97c5a-f14c-4772-a18b-642c95befbac'
    const checkIn = await graphql(
      token,
      'mutation ($input: CheckInAttendanceInput!) { checkInAttendance(input: $input) { trackedSeconds activeSession { id } } }',
      { input: { idempotencyKey: key } },
    )
    expect(checkIn.body.errors).toBeUndefined()
    const sessionId = checkIn.body.data.checkInAttendance.activeSession.id as string

    const retry = await graphql(
      token,
      'mutation ($input: CheckInAttendanceInput!) { checkInAttendance(input: $input) { activeSession { id } } }',
      { input: { idempotencyKey: key } },
    )
    expect(retry.body.data.checkInAttendance.activeSession.id).toBe(sessionId)

    const checkOut = await graphql(
      token,
      'mutation ($input: CheckOutAttendanceInput!) { checkOutAttendance(input: $input) { activeSession { id } trackedSeconds } }',
      { input: { sessionId } },
    )
    expect(checkOut.body.errors).toBeUndefined()
    expect(checkOut.body.data.checkOutAttendance.activeSession).toBeNull()

    const nextCheckIn = await graphql(
      token,
      'mutation ($input: CheckInAttendanceInput!) { checkInAttendance(input: $input) { activeSession { id } trackedSeconds } }',
      { input: { idempotencyKey: 'd901899c-b975-4218-8794-4a69332ec06c' } },
    )
    expect(nextCheckIn.body.data.checkInAttendance.activeSession.id).not.toBe(sessionId)
    expect(nextCheckIn.body.data.checkInAttendance.trackedSeconds).toBeGreaterThanOrEqual(
      checkOut.body.data.checkOutAttendance.trackedSeconds,
    )
  })

  it('caps automatic daily hours at eight and permits a larger admin override', async () => {
    const adminToken = await login('attendance-admin', 'AdminPassword123')
    const sessions = app.get<Model<AttendanceSession>>(getModelToken(AttendanceSession.name))
    const tenantObjectId = new Types.ObjectId(tenantId)
    const memberObjectId = new Types.ObjectId(memberId)
    await sessions.updateMany({ tenantId: tenantObjectId, userId: memberObjectId, endedAt: null }, { $set: { endedAt: new Date() } })

    const week = currentWeek('Asia/Manila')
    const localDate = week.startDate === week.endDate ? week.startDate : addLocalDays(week.startDate, 1)
    const startedAt = new Date(startOfLocalDate(localDate, 'Asia/Manila').getTime() + 60 * 60 * 1000)
    const endedAt = new Date(startedAt.getTime() + 10 * 60 * 60 * 1000)
    await sessions.create({
      tenantId: tenantObjectId,
      userId: memberObjectId,
      startedAt,
      endedAt,
      idempotencyKey: 'historical-ten-hour-session',
    })

    const listingQuery = 'query ($filter: TimesheetsFilter!) { timesheets(filter: $filter) { items { userId totalHours } } }'
    const listing = await graphql(adminToken, listingQuery, {
      filter: { startDate: localDate, endDate: localDate, offset: 0, limit: 20 },
    })
    expect(listing.body.errors).toBeUndefined()
    expect(listing.body.data.timesheets.items).toContainEqual({ userId: memberId, totalHours: '8' })

    const override = await graphql(
      adminToken,
      'mutation ($input: SetTimesheetDayOverrideInput!) { setTimesheetDayOverride(input: $input) { overrideHours effectiveHours revision } }',
      { input: { userId: memberId, localDate, overrideHours: '10.50', expectedRevision: 0 } },
    )
    expect(override.body.errors).toBeUndefined()
    expect(override.body.data.setTimesheetDayOverride).toMatchObject({
      overrideHours: '10.50',
      effectiveHours: '10.5',
      revision: 1,
    })

    const overridden = await graphql(adminToken, listingQuery, {
      filter: { startDate: localDate, endDate: localDate, offset: 0, limit: 20 },
    })
    expect(overridden.body.data.timesheets.items).toContainEqual({ userId: memberId, totalHours: '10.5' })
  })

  it('lets members read only their own tenant timesheet and protects clock roles', async () => {
    const memberToken = await login('attendance-member', 'MemberPassword123')
    const adminToken = await login('attendance-admin', 'AdminPassword123')
    const memberListing = await graphql(
      memberToken,
      'query ($filter: TimesheetsFilter!) { timesheets(filter: $filter) { totalCount items { userId } startDate endDate } }',
      { filter: { offset: 0, limit: 20 } },
    )
    expect(memberListing.body.errors).toBeUndefined()
    expect(memberListing.body.data.timesheets.items).toEqual([{ userId: memberId }])

    const range = memberListing.body.data.timesheets
    const ownDays = await graphql(
      memberToken,
      'query ($filter: TimesheetDaysFilter!) { timesheetDays(filter: $filter) { userId days { localDate effectiveHours } } }',
      { filter: { userId: memberId, startDate: range.startDate, endDate: range.endDate } },
    )
    expect(ownDays.body.errors).toBeUndefined()
    expect(ownDays.body.data.timesheetDays.userId).toBe(memberId)

    const foreignListing = await graphql(
      memberToken,
      'query ($filter: TimesheetsFilter!) { timesheets(filter: $filter) { totalCount } }',
      { filter: { userId: new Types.ObjectId().toHexString(), offset: 0, limit: 20 } },
    )
    expect(foreignListing.body.errors[0].extensions.originalError).toMatchObject({ code: 'FORBIDDEN' })

    const adminClock = await graphql(adminToken, 'query { myAttendance { localDate } }', {})
    expect(adminClock.body.errors[0].extensions.originalError).toMatchObject({ code: 'FORBIDDEN' })
  })

  async function login(username: string, password: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username, password })
      .expect(200)
    return response.body.accessToken as string
  }

  function graphql(accessToken: string, query: string, variables: object) {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-tenant-id', tenantId)
      .send({ query, variables })
      .expect((response) => {
        if (response.status !== 200) throw new Error(`${response.status}: ${JSON.stringify(response.body)}`)
      })
  }
})
