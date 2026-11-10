import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { hash } from 'argon2'
import { Connection, Model, Types } from 'mongoose'
import {
  ConflictException,
  ForbiddenException,
  InvalidInputException,
  NotFoundException,
} from '../../common/exceptions'
import { Session } from '../auth/schemas/session.schema'
import { User, UserDocument, UserRole, UserStatus } from './schemas/user.schema'
import {
  CreateUserInput,
  DeleteUserInput,
  ResetUserPasswordInput,
  UpdateMyProfileInput,
  UpdateUserInput,
  UsersInput,
} from './users.schemas'

export type AuthenticatedUser = Pick<
  User,
  | 'firstName'
  | 'lastName'
  | 'username'
  | 'status'
  | 'role'
  | 'tenantIds'
  | 'currentTenantId'
  | 'tenantSelectionVersion'
> & { id: Types.ObjectId; fullName: string; accountHolderId?: Types.ObjectId }

type CreateUserBase = {
  firstName?: string
  lastName?: string
  username: string
  passwordHash: string
}

type PersistUserInput =
  | (CreateUserBase & {
      role: UserRole.SUPERADMIN
      accountHolderId?: never
      tenantIds?: never
    })
  | (CreateUserBase & {
      role: UserRole.ADMIN
      accountHolderId: Types.ObjectId
      tenantIds: Types.ObjectId[]
    })
  | (CreateUserBase & {
      role: UserRole.MEMBER
      accountHolderId: Types.ObjectId
      tenantIds: [Types.ObjectId]
    })

export type UserRecord = User & { _id: Types.ObjectId }

type TenantUserScope = {
  accountHolderId: Types.ObjectId
  tenantId: Types.ObjectId
}

type UserManagementActor = {
  userId: Types.ObjectId
  role: UserRole
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly users: Model<User>,
    @InjectModel(Session.name) private readonly sessions: Model<Session>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  findByUsername(username: string): Promise<UserDocument | null> {
    return this.users
      .findOne({ username: username.trim().toLowerCase(), status: UserStatus.ACTIVE })
      .select('+passwordHash')
      .exec()
  }

  findById(userId: Types.ObjectId | string): Promise<UserDocument | null> {
    return this.users.findOne({ _id: userId, status: UserStatus.ACTIVE }).exec()
  }

  async usernameExists(username: string): Promise<boolean> {
    return (await this.users.exists({ username: username.trim().toLowerCase() })) !== null
  }

  async create(input: PersistUserInput): Promise<UserDocument> {
    return this.users.create({
      ...input,
      username: input.username.trim().toLowerCase(),
      status: UserStatus.ACTIVE,
      tenantIds: input.tenantIds ?? [],
      currentTenantId: input.role === UserRole.SUPERADMIN ? undefined : input.tenantIds[0],
    })
  }

  async listUsers(
    scope: TenantUserScope,
    input: UsersInput,
  ): Promise<{ items: UserRecord[]; totalCount: number }> {
    const filter = {
      accountHolderId: scope.accountHolderId,
      tenantIds: scope.tenantId,
      role: { $in: [UserRole.ADMIN, UserRole.MEMBER] },
    }
    const [items, totalCount] = await Promise.all([
      this.users
        .find(filter)
        .sort({ username: 1, _id: 1 })
        .skip(input.offset)
        .limit(input.limit)
        .lean<UserRecord[]>()
        .exec(),
      this.users.countDocuments(filter).exec(),
    ])
    return { items, totalCount }
  }

  async provisionUser(
    actor: UserManagementActor,
    scope: TenantUserScope,
    input: CreateUserInput,
  ): Promise<UserDocument> {
    this.assertCanAssignRole(actor.role, input.role)

    try {
      return await this.create({
        username: input.username,
        passwordHash: await hash(input.password),
        role: input.role,
        accountHolderId: scope.accountHolderId,
        tenantIds: [scope.tenantId],
      })
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException('This username is already in use.')
      }
      throw error
    }
  }

  async updateMyProfile(userId: Types.ObjectId, input: UpdateMyProfileInput): Promise<UserDocument> {
    const user = await this.users
      .findOneAndUpdate(
        { _id: userId, status: UserStatus.ACTIVE },
        {
          $set: {
            ...(input.firstName ? { firstName: input.firstName } : {}),
            ...(input.lastName ? { lastName: input.lastName } : {}),
          },
          $unset: {
            ...(input.firstName ? {} : { firstName: 1 }),
            ...(input.lastName ? {} : { lastName: 1 }),
          },
        },
        { new: true, runValidators: true },
      )
      .exec()
    if (!user) throw new NotFoundException('User not found.')
    return user
  }

  async updateUser(
    actor: UserManagementActor,
    scope: TenantUserScope,
    input: UpdateUserInput,
  ): Promise<UserDocument> {
    const user = await this.findUserInScope(scope, input.userId)
    this.assertCanManageUser(actor, user)
    this.assertCanAssignRole(actor.role, input.role)

    if (input.role === UserRole.MEMBER && user.tenantIds.length !== 1) {
      throw new InvalidInputException(
        'Administrators assigned to multiple tenants cannot be changed to members here.',
      )
    }

    const roleChanged = user.role !== input.role
    const update = {
      $set: {
        username: input.username,
        role: input.role,
        ...(input.firstName ? { firstName: input.firstName } : {}),
        ...(input.lastName ? { lastName: input.lastName } : {}),
      },
      $unset: {
        ...(input.firstName ? {} : { firstName: 1 }),
        ...(input.lastName ? {} : { lastName: 1 }),
      },
      ...(roleChanged ? { $inc: { credentialVersion: 1 } } : {}),
    }

    let updated: UserDocument | null
    try {
      updated = await this.users
        .findOneAndUpdate(
          {
            _id: user._id,
            accountHolderId: scope.accountHolderId,
            tenantIds: scope.tenantId,
          },
          update,
          { new: true, runValidators: true },
        )
        .exec()
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException('This username is already in use.')
      }
      throw error
    }

    if (!updated) throw new NotFoundException('User not found.')
    if (roleChanged) await this.sessions.deleteMany({ userId: updated._id }).exec()
    return updated
  }

  async deleteUser(
    actor: UserManagementActor,
    scope: TenantUserScope,
    input: DeleteUserInput,
  ): Promise<boolean> {
    if (actor.userId.equals(input.userId)) {
      throw new InvalidInputException('You cannot delete your own account.')
    }

    const user = await this.findUserInScope(scope, input.userId)
    this.assertCanManageUser(actor, user)
    const databaseSession = await this.connection.startSession()
    let deleted = false

    try {
      await databaseSession.withTransaction(async () => {
        await this.sessions.deleteMany({ userId: user._id }, { session: databaseSession }).exec()
        const result = await this.users.deleteOne(
          {
            _id: user._id,
            accountHolderId: scope.accountHolderId,
            tenantIds: scope.tenantId,
          },
          { session: databaseSession },
        )
        deleted = result.deletedCount === 1
      })
    } finally {
      await databaseSession.endSession()
    }

    if (!deleted) throw new NotFoundException('User not found.')
    return true
  }

  async resetUserPassword(
    actor: UserManagementActor,
    scope: TenantUserScope,
    input: ResetUserPasswordInput,
  ): Promise<UserDocument> {
    if (actor.userId.equals(input.userId)) {
      throw new InvalidInputException('Change your own password from Account settings.')
    }

    const user = await this.findUserInScope(scope, input.userId)
    this.assertCanManageUser(actor, user)
    const passwordHash = await hash(input.newPassword)
    const databaseSession = await this.connection.startSession()
    let updated: UserDocument | null = null

    try {
      await databaseSession.withTransaction(async () => {
        const currentUser = await this.users
          .findOne({
            _id: input.userId,
            accountHolderId: scope.accountHolderId,
            tenantIds: scope.tenantId,
            role: { $in: [UserRole.ADMIN, UserRole.MEMBER] },
          })
          .session(databaseSession)
          .exec()
        if (!currentUser) throw new NotFoundException('User not found.')
        this.assertCanManageUser(actor, currentUser)

        updated = await this.users
          .findOneAndUpdate(
            {
              _id: currentUser._id,
              accountHolderId: scope.accountHolderId,
              tenantIds: scope.tenantId,
              role: currentUser.role,
            },
            { $set: { passwordHash }, $inc: { credentialVersion: 1 } },
            { new: true, runValidators: true, session: databaseSession },
          )
          .exec()
        if (!updated) throw new NotFoundException('User not found.')

        await this.sessions
          .deleteMany({ userId: currentUser._id }, { session: databaseSession })
          .exec()
      })
    } finally {
      await databaseSession.endSession()
    }

    if (!updated) throw new NotFoundException('User not found.')
    return updated
  }

  async updatePassword(userId: Types.ObjectId, passwordHash: string): Promise<void> {
    await this.users.updateOne(
      { _id: userId, status: UserStatus.ACTIVE },
      {
        $set: { passwordHash },
        $inc: { credentialVersion: 1 },
      },
    )
  }

  toAuthenticatedUser(user: UserDocument): AuthenticatedUser {
    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: this.getFullName(user),
      username: user.username,
      status: user.status,
      role: user.role,
      accountHolderId: user.accountHolderId,
      tenantIds: user.tenantIds,
      currentTenantId: user.currentTenantId,
      tenantSelectionVersion: user.tenantSelectionVersion,
    }
  }

  getFullName(user: Pick<User, 'firstName' | 'lastName' | 'username'>): string {
    return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username
  }

  private async findUserInScope(
    scope: TenantUserScope,
    userId: Types.ObjectId,
  ): Promise<UserDocument> {
    const user = await this.users
      .findOne({
        _id: userId,
        accountHolderId: scope.accountHolderId,
        tenantIds: scope.tenantId,
        role: { $in: [UserRole.ADMIN, UserRole.MEMBER] },
      })
      .exec()
    if (!user) throw new NotFoundException('User not found.')
    return user
  }

  private assertCanManageUser(actor: UserManagementActor, user: UserDocument): void {
    if (actor.role === UserRole.ADMIN && user.role !== UserRole.MEMBER) {
      throw new ForbiddenException('Administrators can only manage members.')
    }
  }

  private assertCanAssignRole(actorRole: UserRole, targetRole: UserRole): void {
    if (actorRole === UserRole.ADMIN && targetRole !== UserRole.MEMBER) {
      throw new ForbiddenException('Administrators can only manage members.')
    }
  }
}

function isDuplicateKeyError(error: unknown): error is { code: 11000 } {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000
}
