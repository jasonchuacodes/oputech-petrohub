import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model, Types } from 'mongoose'
import {
  ConflictException,
  ForbiddenException,
  InvalidInputException,
  NotFoundException,
} from '../../common/exceptions'
import { ReportsService } from '../reports/reports.service'
import { FuelSetupService } from '../fuel-setup/fuel-setup.service'
import { InventoryService } from '../inventory/inventory.service'
import { Session as AuthSession } from '../auth/schemas/session.schema'
import { MemberActivity } from '../member-activity/schemas/member-activity.schema'
import { User, UserRole, UserStatus } from '../users/schemas/user.schema'
import { Tenant, TenantStatus } from './schemas/tenant.schema'
import { Shift } from './schemas/shift.schema'
import { RecurringIncomeField } from './schemas/recurring-income-field.schema'
import {
  CreateShiftInput,
  CreateTenantInput,
  DeleteShiftInput,
  DeleteTenantInput,
  UpdateShiftInput,
  UpdateTenantInput,
  UpdateRecurringIncomeConfigurationInput,
} from './tenant.schemas'
import { TenantActor } from './tenant.types'

export type TenantRecord = Tenant & {
  _id: Types.ObjectId
  revision: number
  createdAt: Date
  updatedAt: Date
}

const maxShiftsPerTenant = 20
const shiftCreationAttempts = 5

export type TenantDeletionResult = {
  tenants: number
  memberActivities: number
  users: number
  sessions: number
  userAssignments: number
  reports: number
  disposalBatches: number
  meterHeads: number
  fuelProducts: number
  pumpMeters: number
  inventoryProducts: number
  stockMovements: number
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
    private readonly reportsService: ReportsService,
    private readonly fuelSetupService: FuelSetupService,
    private readonly inventoryService: InventoryService,
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
      throw new InvalidInputException('Tenant account holder must be an active superadmin.')
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
      throw new ForbiddenException('Only administrators can update tenants.')
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

    if (!updated) throw new ForbiddenException('You do not have access to this tenant.')
    return updated
  }

  async delete(user: TenantActor, input: DeleteTenantInput): Promise<boolean> {
    if (user.user.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Only super administrators can delete tenants.')
    }

    const tenant = await this.assertAccess(user, input.tenantId.toHexString())
    const deleted = await this.hardDelete(tenant._id)
    return deleted.tenants === 1
  }

  async listShifts(tenantId: Types.ObjectId): Promise<Shift[]> {
    const tenant = await this.tenantModel
      .findById(tenantId)
      .select('shifts')
      .lean<TenantRecord>()
      .exec()
    if (!tenant) throw new ForbiddenException('You do not have access to this tenant.')
    return sortShifts(tenant.shifts ?? [])
  }

  async createShift(tenantId: Types.ObjectId, input: CreateShiftInput): Promise<Shift> {
    for (let attempt = 0; attempt < shiftCreationAttempts; attempt += 1) {
      const tenant = await this.tenantModel
        .findById(tenantId)
        .select('shifts revision')
        .lean<TenantRecord>()
        .exec()
      if (!tenant) throw new ForbiddenException('You do not have access to this tenant.')

      const shifts = tenant.shifts ?? []
      if (shifts.length >= maxShiftsPerTenant) {
        throw new InvalidInputException(`A tenant can have up to ${maxShiftsPerTenant} shifts.`)
      }
      if (shifts.some((shift) => intervalsOverlap(shift, input))) {
        throw new InvalidInputException('This shift overlaps an existing shift.')
      }

      const shift: Shift = { id: new Types.ObjectId(), ...input }
      const updated = await this.tenantModel
        .findOneAndUpdate(
          { _id: tenantId, revision: tenant.revision },
          { $push: { shifts: shift }, $inc: { revision: 1 } },
          { new: true, runValidators: true },
        )
        .select('_id')
        .lean()
        .exec()
      if (updated) return shift
    }

    throw new ConflictException('Shifts were changed by another request. Please try again.')
  }

  async updateShift(tenantId: Types.ObjectId, input: UpdateShiftInput): Promise<Shift> {
    for (let attempt = 0; attempt < shiftCreationAttempts; attempt += 1) {
      const tenant = await this.tenantModel
        .findById(tenantId)
        .select('shifts revision')
        .lean<TenantRecord>()
        .exec()
      if (!tenant) throw new ForbiddenException('You do not have access to this tenant.')

      const current = tenant.shifts?.find((shift) => shift.id.equals(input.shiftId))
      if (!current) throw new NotFoundException('Shift not found.')
      if (
        tenant.shifts.some(
          (shift) => !shift.id.equals(input.shiftId) && intervalsOverlap(shift, input),
        )
      ) {
        throw new InvalidInputException('This shift overlaps an existing shift.')
      }

      const updated = await this.tenantModel
        .findOneAndUpdate(
          { _id: tenantId, revision: tenant.revision, 'shifts.id': input.shiftId },
          {
            $set: {
              'shifts.$.startTime': input.startTime,
              'shifts.$.endTime': input.endTime,
            },
            $inc: { revision: 1 },
          },
          { new: true, runValidators: true },
        )
        .select('_id')
        .lean()
        .exec()
      if (updated) return { id: input.shiftId, startTime: input.startTime, endTime: input.endTime }
    }

    throw new ConflictException('Shifts were changed by another request. Please try again.')
  }

  async deleteShift(tenantId: Types.ObjectId, input: DeleteShiftInput): Promise<boolean> {
    const updated = await this.tenantModel
      .findOneAndUpdate(
        { _id: tenantId, 'shifts.id': input.shiftId },
        { $pull: { shifts: { id: input.shiftId } }, $inc: { revision: 1 } },
        { new: true, runValidators: true },
      )
      .select('_id')
      .lean()
      .exec()
    if (!updated) throw new NotFoundException('Shift not found.')
    return true
  }

  async getRecurringIncomeConfiguration(tenantId: Types.ObjectId) {
    const tenant = await this.tenantModel
      .findById(tenantId)
      .select('recurringIncomeFields revision')
      .lean<TenantRecord>()
      .exec()
    if (!tenant) throw new ForbiddenException('You do not have access to this tenant.')
    return { revision: tenant.revision, fields: tenant.recurringIncomeFields ?? [] }
  }

  async updateRecurringIncomeConfiguration(
    tenantId: Types.ObjectId,
    input: UpdateRecurringIncomeConfigurationInput,
  ) {
    const tenant = await this.tenantModel
      .findById(tenantId)
      .select('recurringIncomeFields revision')
      .lean<TenantRecord>()
      .exec()
    if (!tenant) throw new ForbiddenException('You do not have access to this tenant.')
    if (tenant.revision !== input.expectedRevision) {
      throw new ConflictException('Income fields were changed by another request. Reload and try again.')
    }

    const currentFields = tenant.recurringIncomeFields ?? []
    const currentById = new Map(currentFields.map((field) => [field.id.toHexString(), field]))
    const suppliedIds = new Set<string>()
    const nextFields: RecurringIncomeField[] = input.fields.map((field) => {
      if (!field.id) {
        return { id: new Types.ObjectId(), description: field.description, active: field.active }
      }
      const id = field.id.toHexString()
      const current = currentById.get(id)
      if (!current) throw new InvalidInputException('Select a valid recurring income field.')
      suppliedIds.add(id)
      return { id: current.id, description: field.description, active: field.active }
    })

    for (const field of currentFields) {
      if (!suppliedIds.has(field.id.toHexString())) nextFields.push({ ...field, active: false })
    }
    if (nextFields.length > 200) {
      throw new InvalidInputException('A tenant can retain up to 200 recurring income fields.')
    }

    const updated = await this.tenantModel
      .findOneAndUpdate(
        { _id: tenantId, revision: input.expectedRevision },
        { $set: { recurringIncomeFields: nextFields }, $inc: { revision: 1 } },
        { new: true, runValidators: true },
      )
      .select('recurringIncomeFields revision')
      .lean<TenantRecord>()
      .exec()
    if (!updated) {
      throw new ConflictException('Income fields were changed by another request. Reload and try again.')
    }
    return { revision: updated.revision, fields: updated.recurringIncomeFields ?? [] }
  }

  async assertAccess(user: TenantActor, tenantIdValue: string): Promise<TenantRecord> {
    if (!/^[a-f\d]{24}$/i.test(tenantIdValue)) {
      throw new InvalidInputException('A valid tenant is required.')
    }

    const tenantId = new Types.ObjectId(tenantIdValue)
    if (user.user.role !== UserRole.SUPERADMIN) {
      const assigned = user.user.tenantIds.some((assignedTenantId) =>
        assignedTenantId.equals(tenantId),
      )
      if (!assigned || !user.user.accountHolderId) {
        throw new ForbiddenException('You do not have access to this tenant.')
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
    if (!tenant) throw new ForbiddenException('You do not have access to this tenant.')

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
        const reportDeletion = await this.reportsService.deleteForTenant(tenantId, databaseSession)
        const setupDeletion = await this.fuelSetupService.deleteForTenant(tenantId, databaseSession)
        const inventoryDeletion = await this.inventoryService.deleteForTenant(tenantId, databaseSession)
        nextResult.reports = reportDeletion.reports
        nextResult.disposalBatches = reportDeletion.disposalBatches
        nextResult.meterHeads = reportDeletion.meterHeads
        nextResult.fuelProducts = setupDeletion.products
        nextResult.pumpMeters = setupDeletion.meters
        nextResult.inventoryProducts = inventoryDeletion.products
        nextResult.stockMovements = inventoryDeletion.movements
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
    if (!/^[a-f\d]{24}$/i.test(value)) {
      throw new InvalidInputException('A valid tenant is required.')
    }
    return new Types.ObjectId(value)
  }
}

function sortShifts(shifts: Shift[]): Shift[] {
  return [...shifts].sort(
    (left, right) =>
      left.startTime.localeCompare(right.startTime) ||
      left.endTime.localeCompare(right.endTime) ||
      left.id.toHexString().localeCompare(right.id.toHexString()),
  )
}

function intervalsOverlap(
  left: Pick<Shift, 'startTime' | 'endTime'>,
  right: Pick<Shift, 'startTime' | 'endTime'>,
): boolean {
  return toSegments(left).some(([leftStart, leftEnd]) =>
    toSegments(right).some(
      ([rightStart, rightEnd]) => Math.max(leftStart, rightStart) < Math.min(leftEnd, rightEnd),
    ),
  )
}

function toSegments(shift: Pick<Shift, 'startTime' | 'endTime'>): Array<[number, number]> {
  const start = toMinutes(shift.startTime)
  const end = toMinutes(shift.endTime)
  return start < end ? [[start, end]] : [[start, 24 * 60], [0, end]]
}

function toMinutes(value: string): number {
  const [hours = 0, minutes = 0] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function emptyDeletionResult(): TenantDeletionResult {
  return {
    tenants: 0,
    memberActivities: 0,
    users: 0,
    sessions: 0,
    userAssignments: 0,
    reports: 0,
    disposalBatches: 0,
    meterHeads: 0,
    fuelProducts: 0,
    pumpMeters: 0,
    inventoryProducts: 0,
    stockMovements: 0,
  }
}
