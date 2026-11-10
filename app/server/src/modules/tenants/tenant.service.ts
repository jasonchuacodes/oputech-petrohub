import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model, Types } from 'mongoose'
import { forbidden, invalidInput } from '../../common/exceptions/errors'
import { Session as AuthSession } from '../auth/schemas/session.schema'
import { MemberActivity } from '../member-activity/schemas/member-activity.schema'
import { User, UserRole, UserStatus } from '../users/schemas/user.schema'
import { Tenant, TenantStatus } from './schemas/tenant.schema'
import { CreateTenantInput, DeleteTenantInput, UpdateTenantInput } from './tenant.schemas'
import { TenantActor } from './tenant.types'

export type TenantRecord = Tenant & {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export type TenantDeletionResult = {
  tenants: number
  memberActivities: number
  users: number
  sessions: number
  userAssignments: number
}

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(MemberActivity.name)
    private readonly memberActivityModel: Model<MemberActivity>,
    @InjectModel(AuthSession.name) private readonly sessionModel: Model<AuthSession>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async listForUser(user: TenantActor): Promise<TenantRecord[]> {
    const filter =
      user.user.role === UserRole.SUPERADMIN
        ? { accountHolderId: user.userId, status: TenantStatus.ACTIVE }
        : {
            _id: { $in: user.user.tenantIds },
            accountHolderId: user.user.accountHolderId,
            status: TenantStatus.ACTIVE,
          }

    return this.tenantModel.find(filter).sort({ name: 1 }).lean<TenantRecord[]>().exec()
  }

  async create(
    accountHolderId: Types.ObjectId,
    input: CreateTenantInput,
  ): Promise<TenantRecord> {
    const accountHolder = await this.userModel
      .findOne({
        _id: accountHolderId,
        role: UserRole.SUPERADMIN,
        status: UserStatus.ACTIVE,
      })
      .select('_id')
      .lean()
      .exec()
    if (!accountHolder) {
      throw invalidInput('Tenant account holder must be an active superadmin.')
    }

    const tenantId = new Types.ObjectId()
    const tenant = await this.tenantModel.create({
      _id: tenantId,
      accountHolderId,
      name: input.name,
      timezone: 'Asia/Manila',
      currency: 'PHP',
    })

    await this.userModel.updateOne(
      { _id: accountHolderId, currentTenantId: { $exists: false } },
      {
        $set: { currentTenantId: tenant._id },
        $inc: { tenantSelectionVersion: 1 },
      },
    )

    return tenant.toObject<TenantRecord>()
  }

  async update(user: TenantActor, input: UpdateTenantInput): Promise<TenantRecord> {
    if (user.user.role === UserRole.MEMBER) {
      throw forbidden('Only administrators can update tenants.')
    }

    const tenant = await this.assertAccess(user, input.tenantId.toHexString())
    const updated = await this.tenantModel
      .findByIdAndUpdate(
        tenant._id,
        { $set: { name: input.name } },
        { new: true, runValidators: true },
      )
      .lean<TenantRecord>()
      .exec()

    if (!updated) throw forbidden('You do not have access to this tenant.')
    return updated
  }

  async delete(user: TenantActor, input: DeleteTenantInput): Promise<boolean> {
    if (user.user.role !== UserRole.SUPERADMIN) {
      throw forbidden('Only super administrators can delete tenants.')
    }

    const tenant = await this.assertAccess(user, input.tenantId.toHexString())
    const deleted = await this.hardDelete(tenant._id)
    return deleted.tenants === 1
  }

  async assertAccess(user: TenantActor, tenantIdValue: string): Promise<TenantRecord> {
    if (!/^[a-f\d]{24}$/i.test(tenantIdValue)) {
      throw invalidInput('A valid tenant is required.')
    }

    const tenantId = new Types.ObjectId(tenantIdValue)
    if (user.user.role !== UserRole.SUPERADMIN) {
      const assigned = user.user.tenantIds.some((assignedTenantId) =>
        assignedTenantId.equals(tenantId),
      )
      if (!assigned || !user.user.accountHolderId) {
        throw forbidden('You do not have access to this tenant.')
      }
    }

    const tenant = await this.tenantModel
      .findOne({
        _id: tenantId,
        accountHolderId:
          user.user.role === UserRole.SUPERADMIN
            ? user.userId
            : user.user.accountHolderId,
        status: TenantStatus.ACTIVE,
      })
      .lean<TenantRecord>()
      .exec()
    if (!tenant) throw forbidden('You do not have access to this tenant.')

    return tenant
  }

  async hardDelete(tenantIdValue: Types.ObjectId | string): Promise<TenantDeletionResult> {
    const tenantId = this.toTenantId(tenantIdValue)
    const databaseSession = await this.connection.startSession()
    let result = emptyDeletionResult()

    try {
      await databaseSession.withTransaction(async () => {
        const tenant = await this.tenantModel.findById(tenantId).session(databaseSession).exec()
        if (!tenant) {
          result = emptyDeletionResult()
          return
        }

        const nextResult = emptyDeletionResult()
        const assignedUsers = await this.userModel
          .find({ tenantIds: tenantId })
          .select('_id role tenantIds currentTenantId')
          .session(databaseSession)
          .exec()
        const deletedUserIds: Types.ObjectId[] = []

        for (const user of assignedUsers) {
          const remainingTenantIds = user.tenantIds.filter((id) => !id.equals(tenantId))
          if (user.role === UserRole.MEMBER || remainingTenantIds.length === 0) {
            deletedUserIds.push(user._id)
            continue
          }

          await this.userModel.updateOne(
            { _id: user._id },
            {
              $set: {
                tenantIds: remainingTenantIds,
                currentTenantId: user.currentTenantId?.equals(tenantId)
                  ? remainingTenantIds[0]
                  : user.currentTenantId,
              },
              $inc: { tenantSelectionVersion: 1 },
            },
            { runValidators: true, session: databaseSession },
          )
          nextResult.userAssignments += 1
        }

        if (deletedUserIds.length > 0) {
          const deletedSessions = await this.sessionModel.deleteMany(
            { userId: { $in: deletedUserIds } },
            { session: databaseSession },
          )
          const deletedUsers = await this.userModel.deleteMany(
            { _id: { $in: deletedUserIds } },
            { session: databaseSession },
          )
          nextResult.sessions = deletedSessions.deletedCount
          nextResult.users = deletedUsers.deletedCount
        }

        const nextOwnedTenant = await this.tenantModel
          .findOne({
            _id: { $ne: tenantId },
            accountHolderId: tenant.accountHolderId,
            status: TenantStatus.ACTIVE,
          })
          .sort({ createdAt: 1 })
          .select('_id')
          .session(databaseSession)
          .exec()
        const owner = await this.userModel
          .findById(tenant.accountHolderId)
          .select('_id currentTenantId')
          .session(databaseSession)
          .exec()
        if (owner) {
          const ownerTenantUpdate = owner.currentTenantId?.equals(tenantId)
            ? nextOwnedTenant
              ? {
                  $set: { currentTenantId: nextOwnedTenant._id },
                  $inc: { tenantSelectionVersion: 1 },
                }
              : { $unset: { currentTenantId: 1 }, $inc: { tenantSelectionVersion: 1 } }
            : { $inc: { tenantSelectionVersion: 1 } }
          await this.userModel.updateOne(
            { _id: tenant.accountHolderId },
            ownerTenantUpdate,
            { session: databaseSession },
          )
        }

        const deletedActivities = await this.memberActivityModel.deleteMany(
          { tenantId },
          { session: databaseSession },
        )
        const deletedTenant = await this.tenantModel.deleteOne(
          { _id: tenantId },
          { session: databaseSession },
        )
        nextResult.memberActivities = deletedActivities.deletedCount
        nextResult.tenants = deletedTenant.deletedCount
        result = nextResult
      })
    } finally {
      await databaseSession.endSession()
    }

    return result
  }

  private toTenantId(value: Types.ObjectId | string): Types.ObjectId {
    if (value instanceof Types.ObjectId) return value
    if (!/^[a-f\d]{24}$/i.test(value)) throw invalidInput('A valid tenant is required.')
    return new Types.ObjectId(value)
  }
}

function emptyDeletionResult(): TenantDeletionResult {
  return { tenants: 0, memberActivities: 0, users: 0, sessions: 0, userAssignments: 0 }
}
