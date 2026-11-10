import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { getModelToken } from '@nestjs/mongoose'
import { hash, verify } from 'argon2'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { Model, Types } from 'mongoose'
import request from 'supertest'
import { configureApplication } from '../../../src/configure-application'
import { TenantService } from '../../../src/modules/tenants/tenant.service'
import { User, UserRole } from '../../../src/modules/users/schemas/user.schema'
import { UsersService } from '../../../src/modules/users/users.service'

const userFields = `
  id
  firstName
  lastName
  fullName
  username
  role
  status
`

describe('user management', () => {
  let replicaSet: MongoMemoryReplSet
  let app: INestApplication
  let tenantId: Types.ObjectId
  let ownerId: Types.ObjectId
  let anotherAdminId: Types.ObjectId

  beforeAll(async () => {
    replicaSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
    process.env.NODE_ENV = 'test'
    process.env.MONGODB_URI = replicaSet.getUri('petromate-users-test')
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
      username: 'users-owner',
      passwordHash: await hash('OwnerPassword123'),
      role: UserRole.SUPERADMIN,
    })
    ownerId = owner._id
    const tenant = await tenants.create(owner._id, { name: 'Users Station' })
    tenantId = tenant._id
    await users.create({
      username: 'users-admin',
      passwordHash: await hash('AdminPassword123'),
      role: UserRole.ADMIN,
      accountHolderId: owner._id,
      tenantIds: [tenant._id],
    })
    const anotherAdmin = await users.create({
      username: 'users-admin-two',
      passwordHash: await hash('AdminTwoPassword123'),
      role: UserRole.ADMIN,
      accountHolderId: owner._id,
      tenantIds: [tenant._id],
    })
    anotherAdminId = anotherAdmin._id
    await users.create({
      username: 'users-member',
      passwordHash: await hash('MemberPassword123'),
      role: UserRole.MEMBER,
      accountHolderId: owner._id,
      tenantIds: [tenant._id],
    })
  }, 60_000)

  afterAll(async () => {
    await app?.close()
    await replicaSet?.stop()
  })

  it('creates and lists tenant users with a resolved full name', async () => {
    const accessToken = await login('users-owner', 'OwnerPassword123')
    const mutation = `
      mutation ($input: CreateUserInput!) {
        createUser(input: $input) { ${userFields} }
      }
    `
    const creation = await graphql(accessToken, mutation, {
      input: {
        username: '  New-Operator  ',
        password: 'TemporaryPassword123',
        role: 'member',
      },
    })

    expect(creation.body.errors).toBeUndefined()
    expect(creation.body.data.createUser).toMatchObject({
      firstName: null,
      lastName: null,
      fullName: 'new-operator',
      username: 'new-operator',
      role: 'member',
      status: 'active',
    })

    const usersModel = app.get<Model<User>>(getModelToken(User.name))
    const stored = await usersModel
      .findById(creation.body.data.createUser.id)
      .select('+passwordHash')
      .exec()
    expect(stored?.passwordHash).not.toBe('TemporaryPassword123')
    expect(await verify(stored?.passwordHash ?? '', 'TemporaryPassword123')).toBe(true)

    const listing = await graphql(
      accessToken,
      `query ($input: UsersInput!) { users(input: $input) { items { ${userFields} } totalCount } }`,
      { input: { offset: 0, limit: 20 } },
    )
    expect(listing.body.errors).toBeUndefined()
    expect(listing.body.data.users.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ username: 'new-operator', fullName: 'new-operator' }),
      ]),
    )

    const duplicate = await graphql(accessToken, mutation, {
      input: { username: 'NEW-OPERATOR', password: 'AnotherPassword123' },
    })
    expect(duplicate.body.errors).toHaveLength(1)
    expect(duplicate.body.errors[0].extensions.originalError).toMatchObject({ code: 'CONFLICT' })
  })

  it('enforces the administrator role matrix and blocks members', async () => {
    const adminToken = await login('users-admin', 'AdminPassword123')
    const memberToken = await login('users-member', 'MemberPassword123')
    const mutation = `
      mutation ($input: CreateUserInput!) {
        createUser(input: $input) { id username role }
      }
    `

    const memberCreation = await graphql(adminToken, mutation, {
      input: { username: 'admin-created-member', password: 'TemporaryPassword123' },
    })
    expect(memberCreation.body.errors).toBeUndefined()
    expect(memberCreation.body.data.createUser.role).toBe('member')

    const adminCreation = await graphql(adminToken, mutation, {
      input: {
        username: 'forbidden-admin',
        password: 'TemporaryPassword123',
        role: 'admin',
      },
    })
    expect(adminCreation.body.errors).toHaveLength(1)
    expect(adminCreation.body.errors[0].extensions.originalError).toMatchObject({ code: 'FORBIDDEN' })

    const memberListing = await graphql(
      memberToken,
      'query ($input: UsersInput!) { users(input: $input) { totalCount } }',
      { input: { offset: 0, limit: 20 } },
    )
    expect(memberListing.body.errors).toHaveLength(1)
    expect(memberListing.body.errors[0].extensions.originalError).toMatchObject({ code: 'FORBIDDEN' })
  })

  it('allows an authenticated user to update their own name', async () => {
    const memberToken = await login('users-member', 'MemberPassword123')
    const profileUpdate = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({
        query: `
          mutation ($input: UpdateMyProfileInput!) {
            updateMyProfile(input: $input) { firstName lastName fullName username }
          }
        `,
        variables: { input: { firstName: '  Updated  ', lastName: '  Member  ' } },
      })
      .expect(200)

    expect(profileUpdate.body.errors).toBeUndefined()
    expect(profileUpdate.body.data.updateMyProfile).toMatchObject({
      firstName: 'Updated',
      lastName: 'Member',
      fullName: 'Updated Member',
      username: 'users-member',
    })

    await request(app.getHttpServer())
      .get('/api/auth/session')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect(200)
      .expect(({ body }) => expect(body.user.fullName).toBe('Updated Member'))
  })

  it('lets administrators reset manageable passwords and revokes target sessions', async () => {
    const ownerToken = await login('users-owner', 'OwnerPassword123')
    const adminToken = await login('users-admin', 'AdminPassword123')
    const memberToken = await login('users-member', 'MemberPassword123')
    const listing = await graphql(
      ownerToken,
      'query ($input: UsersInput!) { users(input: $input) { items { id username } } }',
      { input: { offset: 0, limit: 20 } },
    )
    const memberId = listing.body.data.users.items.find(
      (user: { username: string }) => user.username === 'users-member',
    ).id as string
    const mutation = `
      mutation ($input: ResetUserPasswordInput!) {
        resetUserPassword(input: $input) { id username }
      }
    `

    const reset = await graphql(adminToken, mutation, {
      input: { userId: memberId, newPassword: 'UpdatedPassword123' },
    })
    expect(reset.body.errors).toBeUndefined()
    expect(reset.body.data.resetUserPassword).toMatchObject({
      id: memberId,
      username: 'users-member',
    })

    await request(app.getHttpServer())
      .get('/api/auth/session')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect(401)
    await request(app.getHttpServer())
      .post('/api/auth/session')
      .set('origin', 'http://localhost:5173')
      .send({ username: 'users-member', password: 'MemberPassword123' })
      .expect(401)
    await login('users-member', 'UpdatedPassword123')

    const forbidden = await graphql(adminToken, mutation, {
      input: { userId: anotherAdminId.toHexString(), newPassword: 'UpdatedAdminPassword123' },
    })
    expect(forbidden.body.errors[0].extensions.originalError).toMatchObject({ code: 'FORBIDDEN' })

    const selfReset = await graphql(ownerToken, mutation, {
      input: { userId: ownerId.toHexString(), newPassword: 'UpdatedOwnerPassword123' },
    })
    expect(selfReset.body.errors[0].extensions.originalError).toMatchObject({
      code: 'INVALID_INPUT',
    })
  })

  it('updates users, revokes their session on role change, and deletes them', async () => {
    const ownerToken = await login('users-owner', 'OwnerPassword123')
    const creation = await graphql(
      ownerToken,
      `mutation ($input: CreateUserInput!) { createUser(input: $input) { ${userFields} } }`,
      {
        input: {
          username: 'editable-user',
          password: 'TemporaryPassword123',
        },
      },
    )
    const userId = creation.body.data.createUser.id as string
    const userToken = await login('editable-user', 'TemporaryPassword123')

    const update = await graphql(
      ownerToken,
      `mutation ($input: UpdateUserInput!) { updateUser(input: $input) { ${userFields} } }`,
      {
        input: {
          userId,
          username: 'edited-user',
          firstName: 'Edited',
          lastName: 'Administrator',
          role: 'admin',
        },
      },
    )
    expect(update.body.errors).toBeUndefined()
    expect(update.body.data.updateUser).toMatchObject({
      username: 'edited-user',
      fullName: 'Edited Administrator',
      role: 'admin',
    })

    await request(app.getHttpServer())
      .get('/api/auth/session')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(401)

    const deletion = await graphql(
      ownerToken,
      'mutation ($input: DeleteUserInput!) { deleteUser(input: $input) }',
      { input: { userId } },
    )
    expect(deletion.body.errors).toBeUndefined()
    expect(deletion.body.data.deleteUser).toBe(true)
    expect(await app.get(UsersService).findById(userId)).toBeNull()
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
      .set('x-tenant-id', tenantId.toHexString())
      .send({ query, variables })
      .expect(200)
  }
})
