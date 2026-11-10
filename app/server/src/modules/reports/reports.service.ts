import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/mongoose'
import { ClientSession, Model, Types } from 'mongoose'
import { ConflictException, InvalidInputException, NotFoundException } from '../../common/exceptions'
import { Shift } from '../tenants/schemas/shift.schema'
import { REPORT_CREATED_EVENT, ReportCreatedEvent } from './events/report-created.event'
import { businessDateFor } from './report-date'
import { CreateReportInput, ReportsInput, ReportRevisionInput } from './reports.schemas'
import { Report, ReportStatus } from './schemas/report.schema'

export type ReportRecord = Report & { _id: Types.ObjectId }

type ReportTenant = {
  tenantId: Types.ObjectId
  timezone: string
  shifts: Shift[]
}

type ReportActor = {
  userId: Types.ObjectId
  name: string
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly reports: Model<Report>,
    private readonly events: EventEmitter2,
  ) {}

  async creationContext(tenant: ReportTenant) {
    const businessDate = businessDateFor(tenant.timezone)
    const reports = await this.reports
      .find({ tenantId: tenant.tenantId, businessDate })
      .sort({ createdAt: 1 })
      .lean<ReportRecord[]>()
      .exec()
    const byShift = new Map(reports.map((report) => [report.shiftId.toHexString(), report]))
    const orderedShifts = sortShifts(tenant.shifts)
    const configuredIds = new Set(orderedShifts.map((shift) => shift.id.toHexString()))
    let previousShiftsCreated = true
    const slots = orderedShifts.map((shift) => {
      const report = byShift.get(shift.id.toHexString())
      const canCreate = previousShiftsCreated
      if (!report) previousShiftsCreated = false
      return {
        shift: report
          ? {
              id: report.shiftId,
              startTime: report.interval.startTime,
              endTime: report.interval.endTime,
            }
          : shift,
        report,
        canCreate,
        blockedReason:
          !report && !canCreate ? 'Create the previous shift report first.' : undefined,
      }
    })
    const removed = reports
      .filter((report) => !configuredIds.has(report.shiftId.toHexString()))
      .map((report) => ({
        shift: {
          id: report.shiftId,
          startTime: report.interval.startTime,
          endTime: report.interval.endTime,
        },
        report,
        canCreate: false,
        blockedReason: undefined,
      }))

    return { businessDate, slots: [...slots, ...removed] }
  }

  async createOrOpen(tenant: ReportTenant, actor: ReportActor, input: CreateReportInput) {
    const today = businessDateFor(tenant.timezone)
    if (input.businessDate !== today) {
      throw new InvalidInputException('Reports can only be created for today.')
    }

    const filter = {
      tenantId: tenant.tenantId,
      businessDate: today,
      shiftId: input.shiftId,
    }
    const existing = await this.reports.findOne(filter).lean<ReportRecord>().exec()
    if (existing) return { report: existing, created: false }

    const orderedShifts = sortShifts(tenant.shifts)
    const shiftIndex = orderedShifts.findIndex((item) => item.id.equals(input.shiftId))
    const shift = orderedShifts[shiftIndex]
    if (!shift) throw new InvalidInputException('Select a tenant shift.')

    const previousShiftIds = orderedShifts.slice(0, shiftIndex).map((item) => item.id)
    if (previousShiftIds.length > 0) {
      const previousReportCount = await this.reports.countDocuments({
        tenantId: tenant.tenantId,
        businessDate: today,
        shiftId: { $in: previousShiftIds },
      })
      if (previousReportCount !== previousShiftIds.length) {
        throw new InvalidInputException('Create the previous shift report first.')
      }
    }

    const now = new Date()
    try {
      const report = await this.reports.create({
        ...filter,
        interval: {
          startTime: shift.startTime,
          endTime: shift.endTime,
          timezone: tenant.timezone,
        },
        creatorId: actor.userId,
        creatorName: actor.name,
        status: ReportStatus.DRAFT,
      })
      const record = report.toObject<ReportRecord>()
      await this.events.emitAsync(
        REPORT_CREATED_EVENT,
        new ReportCreatedEvent(tenant.tenantId, actor.userId, record._id, now),
      )
      return { report: record, created: true }
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error
      const winner = await this.reports.findOne(filter).lean<ReportRecord>().exec()
      if (!winner) throw new ConflictException('The report slot was claimed by another request.')
      return { report: winner, created: false }
    }
  }

  async get(tenantId: Types.ObjectId, reportId: Types.ObjectId): Promise<ReportRecord> {
    const report = await this.reports
      .findOne({ _id: reportId, tenantId })
      .lean<ReportRecord>()
      .exec()
    if (!report) throw new NotFoundException('Report not found.')
    return report
  }

  async list(tenantId: Types.ObjectId, input: ReportsInput) {
    const filter = { tenantId }
    const [items, totalCount] = await Promise.all([
      this.reports
        .find(filter)
        .sort({ businessDate: -1, createdAt: -1, _id: -1 })
        .skip(input.offset)
        .limit(input.limit)
        .lean<ReportRecord[]>()
        .exec(),
      this.reports.countDocuments(filter).exec(),
    ])
    return { items, totalCount }
  }

  async submit(
    tenantId: Types.ObjectId,
    actor: ReportActor,
    input: ReportRevisionInput,
  ): Promise<ReportRecord> {
    const report = await this.reports
      .findOneAndUpdate(
        {
          _id: input.reportId,
          tenantId,
          revision: input.expectedRevision,
          status: ReportStatus.DRAFT,
        },
        {
          $set: {
            status: ReportStatus.SUBMITTED,
            submittedAt: new Date(),
            submittedById: actor.userId,
            submittedByName: actor.name,
          },
          $inc: { revision: 1 },
        },
        { new: true, runValidators: true },
      )
      .lean<ReportRecord>()
      .exec()
    if (report) return report

    const current = await this.reports.findOne({ _id: input.reportId, tenantId }).lean().exec()
    if (!current) throw new NotFoundException('Report not found.')
    if (current.status === ReportStatus.SUBMITTED) {
      throw new ConflictException('This report has already been submitted.')
    }
    throw new ConflictException('This report was changed by another request.')
  }

  async delete(tenantId: Types.ObjectId, input: ReportRevisionInput): Promise<boolean> {
    const deleted = await this.reports.deleteOne({
      _id: input.reportId,
      tenantId,
      revision: input.expectedRevision,
    })
    if (deleted.deletedCount === 1) return true

    const exists = await this.reports.exists({ _id: input.reportId, tenantId })
    if (!exists) throw new NotFoundException('Report not found.')
    throw new ConflictException('This report was changed by another request.')
  }

  async deleteForTenant(tenantId: Types.ObjectId, session: ClientSession): Promise<number> {
    const result = await this.reports.deleteMany({ tenantId }, { session })
    return result.deletedCount
  }
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000
}

function sortShifts(shifts: Shift[]): Shift[] {
  return [...shifts].sort(
    (left, right) =>
      left.startTime.localeCompare(right.startTime) ||
      left.endTime.localeCompare(right.endTime) ||
      left.id.toHexString().localeCompare(right.id.toHexString()),
  )
}
