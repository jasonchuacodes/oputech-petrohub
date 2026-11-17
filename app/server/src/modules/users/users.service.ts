import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { hash } from 'argon2'
import { Connection, FilterQuery, Model, Types } from 'mongoose'
import {
  ConflictException,
  ForbiddenException,
  InvalidInputException,
  NotFoundException,
} from '../../common/exceptions'
import { Session } from '../auth/schemas/session.schema'
import { AttendanceService } from '../attendance/attendance.service'
import { assertLocalDate, startOfLocalDate } from '../attendance/attendance-date'
import { User, UserDocument, UserRole, UserStatus } from './schemas/user.schema'
import { UserTenantDeactivation } from './schemas/user-tenant-deactivation.schema'
import {
  CreateUserInput,
  DeactivateUserInput,
  DeleteUserInput,
  ResetUserPasswordInput,
  UserDetailsInput,
  UpdateMyProfileInput,
  UpdateUserInput,
  UsersInput,
} from './users.schemas'
import {
  activeTenantMembershipFilter,
  getTenantDeactivation,
  isTenantMembershipActive,
  TenantUserAvailability,
  tenantAvailabilityFilter,
} from './user-tenant-membership'

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

export type UserManagementRecord = UserRecord & {
  tenantMembership: {
    tenantId: Types.ObjectId
    availability: TenantUserAvailability
    deactivation: null | {
      reason: UserTenantDeactivation['reason']
      details?: string
      effectiveDate: string
      timezone: string
      effectiveAt: string
      recordedAt: string
      recordedById: Types.ObjectId
      recordedByName: string
    }
  }
}

export type UserDetailsRecord = Pick<
  User,
  | 'firstName'
  | 'lastName'
  | 'username'
  | 'role'
  | 'status'
  | 'sss'
  | 'pagibig'
  | 'philhealth'
  | 'tin'
  | 'birthday'
  | 'address'
> & {
  id: Types.ObjectId
  fullName: string
  tenantMembership: UserManagementRecord['tenantMembership']
}

export type MyProfileRecord = Omit<UserDetailsRecord, 'tenantMembership'>

type TenantUserScope = {
  accountHolderId: Types.ObjectId
  tenantId: Types.ObjectId
  timezone: string
}

type UserManagementActor = {
  userId: Types.ObjectId
  role: UserRole
  displayName: string
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly users: Model<User>,
    @InjectModel(Session.name) private readonly sessions: Model<Session>,
    @InjectConnection() private readonly connection: Connection,
    private readonly attendance: AttendanceService,
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
  ): Promise<{
    items: UserManagementRecord[]
    totalCount: number
    asOf: string
    nextTransitionAt: string | null
  }> {
    const asOf = new Date()
    const filter: FilterQuery<User> = {
      accountHolderId: scope.accountHolderId,
      tenantIds: scope.tenantId,
      role: { $in: [UserRole.ADMIN, UserRole.MEMBER] },
      ...tenantAvailabilityFilter(scope.tenantId, input.availability, asOf),
    }
    const scheduledFilter: FilterQuery<User> = {
      accountHolderId: scope.accountHolderId,
      tenantIds: scope.tenantId,
      role: { $in: [UserRole.ADMIN, UserRole.MEMBER] },
      status: UserStatus.ACTIVE,
      tenantDeactivations: {
        $elemMatch: { tenantId: scope.tenantId, effectiveAt: { $gt: asOf } },
      },
    }
    const [items, totalCount, scheduledUsers] = await Promise.all([
      this.users
        .find(filter)
        .sort({ username: 1, _id: 1 })
        .skip(input.offset)
        .limit(input.limit)
        .lean<UserRecord[]>()
        .exec(),
      this.users.countDocuments(filter).exec(),
      this.users
        .find(scheduledFilter)
        .select('tenantDeactivations')
        .lean<UserRecord[]>()
        .exec(),
    ])
    const nextTransitionAt = scheduledUsers
      .map((user) => getTenantDeactivation(user, scope.tenantId)?.effectiveAt)
      .filter((value): value is Date => Boolean(value))
      .sort((left, right) => left.getTime() - right.getTime())[0]
    return {
      items: items.map((user) => this.toManagementRecord(user, scope.tenantId, asOf)),
      totalCount,
      asOf: asOf.toISOString(),
      nextTransitionAt: nextTransitionAt?.toISOString() ?? null,
    }
  }

  async getUserDetails(
    scope: TenantUserScope,
    input: UserDetailsInput,
  ): Promise<UserDetailsRecord> {
    const user = await this.users
      .findOne({
        _id: input.userId,
        accountHolderId: scope.accountHolderId,
        tenantIds: scope.tenantId,
        role: { $in: [UserRole.ADMIN, UserRole.MEMBER] },
      })
      .select('+sss +pagibig +philhealth +tin +birthday +address')
      .lean<UserRecord>()
      .exec()
    if (!user) throw new NotFoundException('User not found.')

    const record = this.toManagementRecord(user, scope.tenantId, new Date())
    return {
      id: record._id,
      firstName: record.firstName,
      lastName: record.lastName,
      fullName: this.getFullName(record),
      username: record.username,
      role: record.role,
      status: record.status,
      tenantMembership: record.tenantMembership,
      sss: record.sss,
      pagibig: record.pagibig,
      philhealth: record.philhealth,
      tin: record.tin,
      birthday: record.birthday,
      address: record.address,
    }
  }

  async getMyProfile(userId: Types.ObjectId): Promise<MyProfileRecord> {
    const user = await this.users
      .findOne({ _id: userId, status: UserStatus.ACTIVE })
      .select('+sss +pagibig +philhealth +tin +birthday +address')
      .lean<UserRecord>()
      .exec()
    if (!user) throw new NotFoundException('User not found.')

    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: this.getFullName(user),
      username: user.username,
      role: user.role,
      status: user.status,
      sss: user.sss,
      pagibig: user.pagibig,
      philhealth: user.philhealth,
      tin: user.tin,
      birthday: user.birthday,
      address: user.address,
    }
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
    const setFields: Record<string, string> = {
      ...(input.firstName ? { firstName: input.firstName } : {}),
      ...(input.lastName ? { lastName: input.lastName } : {}),
    }
    const unsetFields: Record<string, 1> = {
      ...(input.firstName ? {} : { firstName: 1 as const }),
      ...(input.lastName ? {} : { lastName: 1 as const }),
    }
    for (const field of ['sss', 'pagibig', 'philhealth', 'tin', 'birthday', 'address'] as const) {
      const value = input[field]
      if (value === null) unsetFields[field] = 1
      else if (value !== undefined) setFields[field] = value
    }

    const user = await this.users
      .findOneAndUpdate(
        { _id: userId, status: UserStatus.ACTIVE },
        {
          $set: setFields,
          $unset: unsetFields,
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
    const setFields: Record<string, string> = {
      username: input.username,
      role: input.role,
      ...(input.firstName ? { firstName: input.firstName } : {}),
      ...(input.lastName ? { lastName: input.lastName } : {}),
    }
    const unsetFields: Record<string, 1> = {
      ...(input.firstName ? {} : { firstName: 1 as const }),
      ...(input.lastName ? {} : { lastName: 1 as const }),
    }
    for (const field of ['sss', 'pagibig', 'philhealth', 'tin', 'birthday', 'address'] as const) {
      const value = input[field]
      if (value === null) unsetFields[field] = 1
      else if (value !== undefined) setFields[field] = value
    }
    const update = {
      $set: setFields,
      $unset: unsetFields,
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
            ...activeTenantMembershipFilter(scope.tenantId),
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
    void actor
    void scope
    void input
    throw new ForbiddenException('Permanent user deletion is no longer available. Deactivate the user instead.')
  }

  async deactivateUser(
    actor: UserManagementActor,
    scope: TenantUserScope,
    input: DeactivateUserInput,
  ): Promise<UserManagementRecord> {
    if (actor.userId.equals(input.userId)) {
      throw new InvalidInputException('You cannot deactivate your own access.')
    }

    assertLocalDate(input.effectiveDate)
    const recordedAt = new Date()
    const effectiveAt = startOfLocalDate(input.effectiveDate, scope.timezone)
    const user = await this.findUserInScope(scope, input.userId, false)
    this.assertCanManageUser(actor, user)
    if (user.status !== UserStatus.ACTIVE) {
      throw new ConflictException('This user is already inactive.')
    }
    if (getTenantDeactivation(user, scope.tenantId)) {
      throw new ConflictException('This user already has a deactivation for this tenant.')
    }

    const databaseSession = await this.connection.startSession()
    const result: { updated?: UserRecord } = {}
    try {
      await databaseSession.withTransaction(async () => {
        const updatedDocument = await this.users
          .findOneAndUpdate(
            {
              _id: user._id,
              accountHolderId: scope.accountHolderId,
              tenantIds: scope.tenantId,
              role: user.role,
              status: UserStatus.ACTIVE,
              tenantDeactivations: { $not: { $elemMatch: { tenantId: scope.tenantId } } },
            },
            {
              $push: {
                tenantDeactivations: {
                  tenantId: scope.tenantId,
                  reason: input.reason,
                  ...(input.details ? { details: input.details } : {}),
                  effectiveDate: input.effectiveDate,
                  timezone: scope.timezone,
                  effectiveAt,
                  recordedAt,
                  recordedById: actor.userId,
                  recordedByName: actor.displayName,
                },
              },
              $inc: { revision: 1 },
            },
            { new: true, runValidators: true, session: databaseSession },
          )
          .exec()
        if (!updatedDocument) {
          throw new ConflictException('This user was changed. Reload and try again.')
        }
        result.updated = updatedDocument.toObject<UserRecord>()

        if (effectiveAt.getTime() <= recordedAt.getTime()) {
          await this.attendance.closeForDeactivation(
            scope.tenantId,
            user._id,
            recordedAt,
            databaseSession,
          )
        }
      })
    } finally {
      await databaseSession.endSession()
    }

    if (!result.updated) throw new ConflictException('This user was changed. Reload and try again.')
    return this.toManagementRecord(result.updated, scope.tenantId, recordedAt)
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
            ...activeTenantMembershipFilter(scope.tenantId),
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
              ...activeTenantMembershipFilter(scope.tenantId),
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
    const now = new Date()
    const availableTenantIds = user.tenantIds.filter((tenantId) =>
      isTenantMembershipActive(user, tenantId, now),
    )
    const currentTenantId = user.role === UserRole.SUPERADMIN
      ? user.currentTenantId
      : user.currentTenantId && availableTenantIds.some((tenantId) =>
        tenantId.equals(user.currentTenantId)
      )
        ? user.currentTenantId
        : availableTenantIds[0]
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
      currentTenantId,
      tenantSelectionVersion: user.tenantSelectionVersion,
    }
  }

  getTenantDeactivationCutoffs(
    user: Pick<User, 'tenantDeactivations'>,
  ): Array<{ tenantId: Types.ObjectId; effectiveAt: Date }> {
    return (user.tenantDeactivations ?? []).map((event) => ({
      tenantId: event.tenantId,
      effectiveAt: event.effectiveAt,
    }))
  }

  getFullName(user: Pick<User, 'firstName' | 'lastName' | 'username'>): string {
    return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username
  }

  private async findUserInScope(
    scope: TenantUserScope,
    userId: Types.ObjectId,
    requireActive = true,
  ): Promise<UserDocument> {
    const user = await this.users
      .findOne({
        _id: userId,
        accountHolderId: scope.accountHolderId,
        tenantIds: scope.tenantId,
        role: { $in: [UserRole.ADMIN, UserRole.MEMBER] },
        ...(requireActive ? activeTenantMembershipFilter(scope.tenantId) : {}),
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

  private toManagementRecord(
    user: UserRecord,
    tenantId: Types.ObjectId,
    asOf: Date,
  ): UserManagementRecord {
    const event = getTenantDeactivation(user, tenantId)
    return {
      ...user,
      tenantMembership: {
        tenantId,
        availability: isTenantMembershipActive(user, tenantId, asOf)
          ? TenantUserAvailability.ACTIVE
          : TenantUserAvailability.INACTIVE,
        deactivation: event
          ? {
              reason: event.reason,
              details: event.details,
              effectiveDate: event.effectiveDate,
              timezone: event.timezone,
              effectiveAt: event.effectiveAt.toISOString(),
              recordedAt: event.recordedAt.toISOString(),
              recordedById: event.recordedById,
              recordedByName: event.recordedByName,
            }
          : null,
      },
    }
  }
}

function isDuplicateKeyError(error: unknown): error is { code: 11000 } {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000
}
