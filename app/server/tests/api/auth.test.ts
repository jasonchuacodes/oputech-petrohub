import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { hash } from 'argon2'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { getConnectionToken, getModelToken } from '@nestjs/mongoose'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Connection, Model, Types } from 'mongoose'
import request from 'supertest'
import { configureApplication } from '../../src/configure-application'
import {
  REPORT_CREATED_EVENT,
  ReportCreatedEvent,
} from '../../src/modules/reports/events/report-created.event'
import { TenantService } from '../../src/modules/tenants/tenant.service'
import { User, UserRole } from '../../src/modules/users/schemas/user.schema'
import { UsersService } from '../../src/modules/users/users.service'

describe('authentication', () => {
  let replicaSet: MongoMemoryReplSet
  let app: INestApplication
  let tenantId: Types.ObjectId
  let secondTenantId: Types.ObjectId
  let memberId: Types.ObjectId
  let accountHolderId: Types.ObjectId

  beforeAll(async () => {
    replicaSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
    process.env.NODE_ENV = 'test'
    process.env.MONGODB_URI = replicaSet.getUri('petromate-test')
    process.env.CLIENT_ORIGIN = 'http://localhost:5173'
    process.env.AUTH_ACCESS_TOKEN_SECRET = 'test-access-secret-at-least-32-characters'
    process.env.AUTH_REFRESH_TOKEN_SECRET = 'test-refresh-secret-at-least-32-characters'
    process.env.SUPERADMIN_SCRIPT_SECRET = 'test-superadmin-secret-at-least-32-characters'
    process.env.LOG_LEVEL = 'silent'

    const { AppModule } = await import('../../src/app.module')
    app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] })
    configureApplication(app)
    await app.init()

    const users = app.get(UsersService)
    const tenants = app.get(TenantService)
    const accountHolder = await users.create({
      firstName: 'Account',
      lastName: 'Holder',
      username: 'owner',
      passwordHash: await hash('OwnerPassword123'),
      role: UserRole.SUPERADMIN,
    })
    accountHolderId = accountHolder._id
    const tenant = await tenants.create(accountHolder._id, {
      name: 'Test Station',
    })
    const secondTenant = await tenants.create(accountHolder._id, {
      name: 'Second Station',
    })
    const user = await users.create({
      firstName: 'Test',
      lastName: 'Admin',
      username: 'admin',
      passwordHash: await hash('StrongPassword123'),
      role: UserRole.ADMIN,
      accountHolderId: accountHolder._id,
      tenantIds: [tenant._id],
    })
    await users.create({
      firstName: 'Test',
      lastName: 'Member',
      username: 'member',
      passwordHash: await hash('MemberPassword123'),
      role: UserRole.MEMBER,
      accountHolderId: accountHolder._id,
      tenantIds: [tenant._id],
    })
    tenantId = tenant._id
    secondTenantId = secondTenant._id
    memberId = user._id
  }, 60_000)

  afterAll(async () => {
    await app?.close()
    await replicaSet?.stop()
  })

  it('requires the configured origin for login', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/session')
      .send({ username: 'admin', password: 'StrongPassword123' })
      .expect(403)
  })

  it('registers a superadmin and creates their first tenant', async () => {
    const input = {
      username: 'Registered-Owner',
      password: '123456',
    }

    await request(app.getHttpServer()).post('/api/auth/register').send(input).expect(403)

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .set('x-superadmin-script-secret', 'invalid-secret')
      .send(input)
      .expect(403)

    const registration = await request(app.getHttpServer())
      .post('/api/auth/register')
      .set('x-superadmin-script-secret', process.env.SUPERADMIN_SCRIPT_SECRET!)
      .send(input)
      .expect(201)

    expect(registration.body).toMatchObject({
      username: 'registered-owner',
      role: UserRole.SUPERADMIN,
    })
    expect(registration.body.shouldChangePassword).toBeUndefined()
    expect(registration.body.displayName).toBeUndefined()

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .set('x-superadmin-script-secret', process.env.SUPERADMIN_SCRIPT_SECRET!)
      .send(input)
      .expect(409)

    const login = await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'registered-owner', password: input.password })
      .expect(200)
    expect(login.body.user).toMatchObject({
      username: 'registered-owner',
      fullName: 'registered-owner',
      role: UserRole.SUPERADMIN,
    })
    expect(login.body.user.shouldChangePassword).toBeUndefined()
    expect(login.body.tenantAccess).toEqual([])

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({
        query: 'mutation ($input: CreateTenantInput!) { createTenant(input: $input) { id } }',
        variables: { input: { name: '   ' } },
      })
      .expect(200)
      .expect(({ body }) => expect(body.errors).toHaveLength(1))

    const creation = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({
        query:
          'mutation ($input: CreateTenantInput!) { createTenant(input: $input) { id name timezone currency } }',
        variables: { input: { name: '  Registered Station  ' } },
      })
      .expect(200)
    expect(creation.body.errors).toBeUndefined()
    expect(creation.body.data.createTenant).toMatchObject({
      name: 'Registered Station',
      timezone: 'Asia/Manila',
      currency: 'PHP',
    })

    const cookie = (login.headers['set-cookie'] as unknown as string[] | undefined)?.[0]
    if (!cookie) throw new Error('Login did not set a refresh cookie')
    await request(app.getHttpServer())
      .post('/api/auth/session/refresh')
      .set('origin', 'http://localhost:5173')
      .set('Cookie', [cookie])
      .send({})
      .expect(200)
      .expect(({ body }) => {
        expect(body.user.currentTenantId).toBe(creation.body.data.createTenant.id)
        expect(body.tenantAccess).toEqual([
          {
            tenantId: creation.body.data.createTenant.id,
            role: UserRole.SUPERADMIN,
          },
        ])
      })
  })

  it('enforces tenant assignment by role at the database boundary', async () => {
    const users = app.get<Model<User>>(getModelToken(User.name))
    const tenants = app.get(TenantService)

    await expect(
      users.create({
        username: 'invalid-admin',
        passwordHash: await hash('InvalidPassword123'),
        role: UserRole.ADMIN,
      }),
    ).rejects.toThrow(/accountHolderId|tenantIds/)

    await expect(
      users.create({
        username: 'invalid-owner',
        passwordHash: await hash('InvalidPassword123'),
        role: UserRole.SUPERADMIN,
        tenantIds: [tenantId],
      }),
    ).rejects.toThrow(/tenantIds/)

    await expect(
      tenants.create(memberId, {
        name: 'Invalid Ownership',
      }),
    ).rejects.toThrow(/active superadmin/)
  })

  it('creates, refreshes, authenticates, and revokes a session', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'admin', password: 'StrongPassword123' })
      .expect(200)

    expect(login.body.user).toMatchObject({
      username: 'admin',
      firstName: 'Test',
      lastName: 'Admin',
      fullName: 'Test Admin',
      role: 'admin',
    })
    expect(login.body.user.passwordHash).toBeUndefined()
    expect(login.body.user.credentialVersion).toBeUndefined()
    expect(login.body.user.displayName).toBeUndefined()
    expect(login.body.tenantAccess).toEqual([
      expect.objectContaining({ tenantId: tenantId.toHexString(), role: 'admin' }),
    ])
    expect(login.body).toMatchObject({
      accessToken: expect.any(String),
      tokenType: 'access',
      dateTimeExpiration: expect.any(String),
    })

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({
        query: 'mutation ($input: CreateTenantInput!) { createTenant(input: $input) { id } }',
        variables: { input: { name: 'Forbidden Station' } },
      })
      .expect(200)
      .expect(({ body }) => expect(body.errors).toHaveLength(1))
    const cookie = (login.headers['set-cookie'] as unknown as string[] | undefined)?.[0]
    if (!cookie) throw new Error('Login did not set a refresh cookie')
    expect(cookie).toContain('petromate_refresh=')
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('Path=/api/auth/session')

    await request(app.getHttpServer())
      .get('/api/auth/session')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .expect(200)
      .expect(({ body }) => expect(body.user.username).toBe('admin'))

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({ query: '{ tenants { role tenant { name } } }' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined()
        expect(body.data.tenants[0].role).toBe('admin')
        expect(body.data.tenants[0].tenant.name).toBe('Test Station')
      })

    const activeTenantId = login.body.tenantAccess[0].tenantId as string
    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .set('x-tenant-id', activeTenantId)
      .send({ query: '{ activeTenant { id name } }' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined()
        expect(body.data.activeTenant).toMatchObject({ id: activeTenantId, name: 'Test Station' })
      })

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .set('x-tenant-id', '507f1f77bcf86cd799439011')
      .send({ query: '{ activeTenant { id } }' })
      .expect(200)
      .expect(({ body }) => expect(body.errors).toHaveLength(1))

    const refresh = await request(app.getHttpServer())
      .post('/api/auth/session/refresh')
      .set('origin', 'http://localhost:5173')
      .set('Cookie', [cookie])
      .send({})
      .expect(200)
    const refreshedCookie = (
      refresh.headers['set-cookie'] as unknown as string[] | undefined
    )?.[0]
    if (!refreshedCookie) throw new Error('Refresh did not rotate the refresh cookie')
    expect(refresh.body.accessToken).toEqual(expect.any(String))

    await request(app.getHttpServer())
      .post('/api/auth/session/refresh')
      .set('origin', 'http://localhost:5173')
      .set('Cookie', [cookie])
      .send({})
      .expect(401)

    await request(app.getHttpServer())
      .delete('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .set('Cookie', [refreshedCookie])
      .send({})
      .expect(204)

    await request(app.getHttpServer())
      .get('/api/auth/session')
      .set('Authorization', `Bearer ${refresh.body.accessToken}`)
      .expect(401)

    await request(app.getHttpServer())
      .post('/api/auth/session/refresh')
      .set('Cookie', [refreshedCookie])
      .send({})
      .expect(403)

    await request(app.getHttpServer())
      .post('/api/auth/session/refresh')
      .set('origin', 'http://localhost:5173')
      .set('Cookie', [refreshedCookie])
      .send({})
      .expect(401)
  })

  it('gives the superadmin access to every tenant they own', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'owner', password: 'OwnerPassword123' })
      .expect(200)
    expect(login.body.user.role).toBe('superadmin')
    expect(login.body.tenantAccess).toEqual([
      { tenantId: secondTenantId.toHexString(), role: 'superadmin' },
      { tenantId: tenantId.toHexString(), role: 'superadmin' },
    ])

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({ query: '{ tenants { role tenant { name } } }' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined()
        expect(body.data.tenants).toEqual([
          { role: 'superadmin', tenant: { name: 'Second Station' } },
          { role: 'superadmin', tenant: { name: 'Test Station' } },
        ])
      })

    for (const ownedTenantId of [tenantId, secondTenantId]) {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${login.body.accessToken}`)
        .set('x-tenant-id', ownedTenantId.toHexString())
        .send({ query: '{ activeTenant { id } }' })
        .expect(200)
        .expect(({ body }) => expect(body.errors).toBeUndefined())
    }
  })

  it('scopes members to their assigned tenant', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'member', password: 'MemberPassword123' })
      .expect(200)
    expect(login.body.user.role).toBe('member')
    expect(login.body.tenantAccess).toHaveLength(1)

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .set('x-tenant-id', secondTenantId.toHexString())
      .send({ query: '{ activeTenant { id } }' })
      .expect(200)
      .expect(({ body }) => expect(body.errors).toHaveLength(1))
  })

  it('allows administrators to rename accessible tenants', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'admin', password: 'StrongPassword123' })
      .expect(200)
    const mutation =
      'mutation ($input: UpdateTenantInput!) { updateTenant(input: $input) { id name } }'

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${adminLogin.body.accessToken}`)
      .send({
        query: mutation,
        variables: { input: { tenantId: tenantId.toHexString(), name: 'Renamed Station' } },
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined()
        expect(body.data.updateTenant).toEqual({
          id: tenantId.toHexString(),
          name: 'Renamed Station',
        })
      })

    const memberLogin = await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'member', password: 'MemberPassword123' })
      .expect(200)
    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${memberLogin.body.accessToken}`)
      .send({
        query: mutation,
        variables: { input: { tenantId: tenantId.toHexString(), name: 'Forbidden Rename' } },
      })
      .expect(200)
      .expect(({ body }) => expect(body.errors).toHaveLength(1))

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${adminLogin.body.accessToken}`)
      .send({
        query: mutation,
        variables: { input: { tenantId: tenantId.toHexString(), name: 'Test Station' } },
      })
      .expect(200)
      .expect(({ body }) => expect(body.errors).toBeUndefined())
  })

  it('allows only the owning superadmin to delete a tenant', async () => {
    const tenants = app.get(TenantService)
    const tenant = await tenants.create(accountHolderId, { name: 'Delete Through API' })
    const mutation =
      'mutation ($input: DeleteTenantInput!) { deleteTenant(input: $input) }'
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'admin', password: 'StrongPassword123' })
      .expect(200)

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${adminLogin.body.accessToken}`)
      .send({
        query: mutation,
        variables: { input: { tenantId: tenant._id.toHexString() } },
      })
      .expect(200)
      .expect(({ body }) => expect(body.errors).toHaveLength(1))

    const ownerLogin = await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'owner', password: 'OwnerPassword123' })
      .expect(200)
    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${ownerLogin.body.accessToken}`)
      .send({
        query: mutation,
        variables: { input: { tenantId: tenant._id.toHexString() } },
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined()
        expect(body.data.deleteTenant).toBe(true)
      })
  })

  it('records report creation activity exactly once', async () => {
    const reportId = new Types.ObjectId()
    const events = app.get(EventEmitter2)
    const connection = app.get<Connection>(getConnectionToken())
    const event = new ReportCreatedEvent(tenantId, memberId, reportId, new Date())

    await events.emitAsync(REPORT_CREATED_EVENT, event)
    await events.emitAsync(REPORT_CREATED_EVENT, event)

    const activities = await connection
      .collection('memberActivities')
      .find({ tenantId, entityId: reportId })
      .toArray()
    expect(activities).toHaveLength(1)
    expect(activities[0]?.action).toBe(`created report: ${reportId.toHexString()}`)
  })

  it('hard-deletes a tenant and its dependent records', async () => {
    const users = app.get(UsersService)
    const tenants = app.get(TenantService)
    const connection = app.get<Connection>(getConnectionToken())
    const events = app.get(EventEmitter2)
    const tenant = await tenants.create(accountHolderId, {
      name: 'Temporary Station',
    })
    const admin = await users.create({
      username: 'temporary-admin',
      passwordHash: await hash('TemporaryAdmin123'),
      role: UserRole.ADMIN,
      accountHolderId,
      tenantIds: [tenant._id, secondTenantId],
    })
    const member = await users.create({
      username: 'temporary-member',
      passwordHash: await hash('TemporaryMember123'),
      role: UserRole.MEMBER,
      accountHolderId,
      tenantIds: [tenant._id],
    })
    const reportId = new Types.ObjectId()

    await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'temporary-member', password: 'TemporaryMember123' })
      .expect(200)
    await events.emitAsync(
      REPORT_CREATED_EVENT,
      new ReportCreatedEvent(tenant._id, member._id, reportId, new Date()),
    )
    await connection.collection('attendanceSessions').insertOne({
      tenantId: tenant._id,
      userId: member._id,
      startedAt: new Date(),
      endedAt: null,
      idempotencyKey: 'tenant-deletion-attendance',
    })
    await connection.collection('timesheetDays').insertOne({
      tenantId: tenant._id,
      userId: member._id,
      localDate: '2026-11-11',
      overrideHours: null,
      updatedById: admin._id,
      revision: 1,
    })

    const deleted = await tenants.hardDelete(tenant._id)

    expect(deleted).toEqual({
      tenants: 1,
      memberActivities: 1,
      users: 1,
      sessions: 1,
      userAssignments: 1,
      reports: 0,
      disposalBatches: 0,
      meterHeads: 0,
      fuelProducts: 0,
      pumpMeters: 0,
      inventoryProducts: 0,
      stockMovements: 0,
      attendanceSessions: 1,
      timesheetDays: 1,
    })
    expect(await connection.collection('tenants').findOne({ _id: tenant._id })).toBeNull()
    expect(
      await connection.collection('memberActivities').findOne({ tenantId: tenant._id }),
    ).toBeNull()
    expect(await connection.collection('users').findOne({ _id: member._id })).toBeNull()
    expect(await connection.collection('sessions').findOne({ userId: member._id })).toBeNull()
    expect(await connection.collection('attendanceSessions').findOne({ tenantId: tenant._id })).toBeNull()
    expect(await connection.collection('timesheetDays').findOne({ tenantId: tenant._id })).toBeNull()

    const preservedAdmin = await connection.collection('users').findOne({ _id: admin._id })
    expect(preservedAdmin?.tenantIds).toEqual([secondTenantId])
    expect(preservedAdmin?.currentTenantId).toEqual(secondTenantId)
  })

  it('revokes existing sessions when the password changes', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'admin', password: 'StrongPassword123' })
      .expect(200)
    const cookie = (login.headers['set-cookie'] as unknown as string[] | undefined)?.[0]
    if (!cookie) throw new Error('Login did not set a refresh cookie')

    await request(app.getHttpServer())
      .post('/api/auth/change-password')
      .set('origin', 'http://localhost:5173')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({ currentPassword: 'StrongPassword123', newPassword: 'NewStrongPassword456' })
      .expect(200)

    await request(app.getHttpServer())
      .get('/api/auth/session')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .expect(401)

    await request(app.getHttpServer())
      .post('/api/auth/session/refresh')
      .set('origin', 'http://localhost:5173')
      .set('Cookie', [cookie])
      .send({})
      .expect(401)

    await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'admin', password: 'StrongPassword123' })
      .expect(401)

    await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'admin', password: 'NewStrongPassword456' })
      .expect(200)
  })
})
