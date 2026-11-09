import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { hash } from 'argon2'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { getConnectionToken } from '@nestjs/mongoose'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Connection, Types } from 'mongoose'
import request from 'supertest'
import { configureApplication } from '../../src/configure-application'
import { MembershipRole } from '../../src/modules/memberships/schemas/membership.schema'
import { MembershipsService } from '../../src/modules/memberships/memberships.service'
import {
  REPORT_CREATED_EVENT,
  ReportCreatedEvent,
} from '../../src/modules/reports/events/report-created.event'
import { TenantsService } from '../../src/modules/tenants/tenants.service'
import { UsersService } from '../../src/modules/users/users.service'

describe('authentication', () => {
  let replicaSet: MongoMemoryReplSet
  let app: INestApplication
  let tenantId: Types.ObjectId
  let memberId: Types.ObjectId

  beforeAll(async () => {
    replicaSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
    process.env.NODE_ENV = 'test'
    process.env.MONGODB_URI = replicaSet.getUri('petromate-test')
    process.env.CLIENT_ORIGIN = 'http://localhost:5173'
    process.env.SESSION_COOKIE_NAME = 'petromate_session'
    process.env.LOG_LEVEL = 'silent'

    const { AppModule } = await import('../../src/app.module')
    app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] })
    configureApplication(app)
    await app.init()

    const users = app.get(UsersService)
    const tenants = app.get(TenantsService)
    const memberships = app.get(MembershipsService)
    const user = await users.create({
      displayName: 'Test Admin',
      username: 'admin',
      passwordHash: await hash('StrongPassword123'),
      shouldChangePassword: false,
    })
    const tenant = await tenants.create({
      name: 'Test Station',
      key: 'test-station',
      timezone: 'Asia/Manila',
      currency: 'PHP',
    })
    const membership = await memberships.create({
      tenantId: tenant._id,
      userId: user._id,
      employeeCode: '0001',
      role: MembershipRole.Admin,
    })
    tenantId = tenant._id
    memberId = membership._id
  }, 60_000)

  afterAll(async () => {
    await app?.close()
    await replicaSet?.stop()
  })

  it('requires the configured origin for login', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'StrongPassword123' })
      .expect(403)
  })

  it('creates, authenticates, and revokes an opaque session', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'admin', password: 'StrongPassword123' })
      .expect(200)

    expect(login.body.user).toMatchObject({ username: 'admin', displayName: 'Test Admin' })
    expect(login.body.user.passwordHash).toBeUndefined()
    expect(login.body.memberships).toHaveLength(1)
    expect(login.body.csrfToken).toEqual(expect.any(String))
    const cookie = (login.headers['set-cookie'] as unknown as string[] | undefined)?.[0]
    if (!cookie) throw new Error('Login did not set a session cookie')
    expect(cookie).toContain('petromate_session=')
    expect(cookie).toContain('HttpOnly')

    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Cookie', [cookie])
      .expect(200)
      .expect(({ body }) => expect(body.user.username).toBe('admin'))

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Cookie', [cookie])
      .send({ query: '{ viewer { username } myTenants { role tenant { name } } }' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined()
        expect(body.data.viewer.username).toBe('admin')
        expect(body.data.myTenants[0].tenant.name).toBe('Test Station')
      })

    const tenantId = login.body.memberships[0].tenantId as string
    await request(app.getHttpServer())
      .post('/graphql')
      .set('Cookie', [cookie])
      .set('x-tenant-id', tenantId)
      .send({ query: '{ activeTenant { id name } }' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined()
        expect(body.data.activeTenant).toMatchObject({ id: tenantId, name: 'Test Station' })
      })

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Cookie', [cookie])
      .set('x-tenant-id', '507f1f77bcf86cd799439011')
      .send({ query: '{ activeTenant { id } }' })
      .expect(200)
      .expect(({ body }) => expect(body.errors).toHaveLength(1))

    await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('origin', 'http://localhost:5173')
      .set('Cookie', [cookie])
      .expect(403)

    await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('origin', 'http://localhost:5173')
      .set('Cookie', [cookie])
      .set('x-csrf-token', login.body.csrfToken)
      .expect(200)

    await request(app.getHttpServer()).get('/api/auth/me').set('Cookie', [cookie]).expect(401)
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

  it('revokes existing sessions when the password changes', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'admin', password: 'StrongPassword123' })
      .expect(200)
    const cookie = (login.headers['set-cookie'] as unknown as string[] | undefined)?.[0]
    if (!cookie) throw new Error('Login did not set a session cookie')

    await request(app.getHttpServer())
      .post('/api/auth/change-password')
      .set('origin', 'http://localhost:5173')
      .set('Cookie', [cookie])
      .set('x-csrf-token', login.body.csrfToken)
      .send({ currentPassword: 'StrongPassword123', newPassword: 'NewStrongPassword456' })
      .expect(200)

    await request(app.getHttpServer()).get('/api/auth/me').set('Cookie', [cookie]).expect(401)

    await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'admin', password: 'StrongPassword123' })
      .expect(401)

    await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'admin', password: 'NewStrongPassword456' })
      .expect(200)
  })
})
