import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { forbidden, invalidInput } from '../../common/exceptions/errors'
import { User, UserRole, UserStatus } from '../users/schemas/user.schema'
import { Tenant, TenantStatus } from './schemas/tenant.schema'
import { CreateTenantInput, TenantActor } from './tenant.types'

export type TenantRecord = Tenant & {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
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

    const tenant = await this.tenantModel.create({
      ...input,
      accountHolderId,
      key: input.key.trim().toLowerCase(),
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

  findByKey(key: string): Promise<TenantRecord | null> {
    return this.tenantModel
      .findOne({ key: key.trim().toLowerCase() })
      .lean<TenantRecord>()
      .exec()
  }
}
