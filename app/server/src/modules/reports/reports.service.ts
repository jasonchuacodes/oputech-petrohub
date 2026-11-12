import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { ClientSession, Connection, Model, Types } from 'mongoose'
import { ConflictException, ForbiddenException, InvalidInputException, NotFoundException } from '../../common/exceptions'
import { decimal, decimal128, sum } from '../../common/numeric/decimal'
import { DisposalsService, DisposalBatchRecord } from '../disposals/disposals.service'
import { Shift } from '../tenants/schemas/shift.schema'
import { RecurringIncomeField } from '../tenants/schemas/recurring-income-field.schema'
import { UserRole } from '../users/schemas/user.schema'
import { InventoryService } from '../inventory/inventory.service'
import { StockMovementService } from '../inventory/stock-movement.service'
import { REPORT_CREATED_EVENT, ReportCreatedEvent } from './events/report-created.event'
import { businessDateFor } from './report-date'
import {
  CreateReportInput,
  DeleteReportInput,
  ReportsInput,
  ReportTransitionInput,
  SaveReportDraftInput,
} from './reports.schemas'
import { Report, ReportFinancialEntry, ReportStatus } from './schemas/report.schema'

export type ReportRecord = Report & { _id: Types.ObjectId }

type ReportTenant = {
  tenantId: Types.ObjectId
  timezone: string
  currency: string
  shifts: Shift[]
  recurringIncomeFields: RecurringIncomeField[]
}

type ReportActor = {
  userId: Types.ObjectId
  name: string
  role: UserRole
}

export type ReportDetailRecord = { report: ReportRecord; disposals?: DisposalBatchRecord }

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly reports: Model<Report>,
    @InjectConnection() private readonly connection: Connection,
    private readonly disposals: DisposalsService,
    private readonly inventory: InventoryService,
    private readonly stockMovements: StockMovementService,
    private readonly events: EventEmitter2,
  ) {}

  async creationContext(tenant: ReportTenant) {
    const businessDate = businessDateFor(tenant.timezone)
    const reports = await this.reports
      .find({ tenantId: tenant.tenantId, businessDate, effective: { $ne: false } })
      .sort({ createdAt: 1 })
      .lean<ReportRecord[]>()
      .exec()
    const byShift = new Map(reports.map((report) => [report.shiftId.toHexString(), report]))
    const orderedShifts = sortShifts(tenant.shifts)
    const configuredIds = new Set(orderedShifts.map((shift) => shift.id.toHexString()))
    let previousSubmitted = true
    const slots = orderedShifts.map((shift) => {
      const report = byShift.get(shift.id.toHexString())
      const canCreate = !report && previousSubmitted
      const blockedReason = report
        ? undefined
        : previousSubmitted
          ? undefined
          : 'Submit the previous shift report first.'
      if (!report || report.status !== ReportStatus.SUBMITTED) previousSubmitted = false
      return {
        shift: report
          ? { id: report.shiftId, startTime: report.interval.startTime, endTime: report.interval.endTime }
          : shift,
        report,
        canCreate,
        blockedReason,
      }
    })
    const removed = reports.filter((report) => !configuredIds.has(report.shiftId.toHexString())).map((report) => ({
      shift: { id: report.shiftId, startTime: report.interval.startTime, endTime: report.interval.endTime },
      report,
      canCreate: false,
      blockedReason: undefined,
    }))
    return { businessDate, slots: [...slots, ...removed] }
  }

  async createOrOpen(tenant: ReportTenant, actor: ReportActor, input: CreateReportInput) {
    const today = businessDateFor(tenant.timezone)
    if (input.businessDate !== today) throw new InvalidInputException('Reports can only be created for today.')
    const slotFilter = { tenantId: tenant.tenantId, businessDate: today, shiftId: input.shiftId }
    const activeFilter = { ...slotFilter, effective: { $ne: false } }
    const existing = await this.reports.findOne(activeFilter).lean<ReportRecord>().exec()
    if (existing) return { report: existing, created: false }

    const orderedShifts = sortShifts(tenant.shifts)
    const shiftIndex = orderedShifts.findIndex((item) => item.id.equals(input.shiftId))
    const shift = orderedShifts[shiftIndex]
    if (!shift) throw new InvalidInputException('Select a tenant shift.')
    const previousShiftIds = orderedShifts.slice(0, shiftIndex).map((item) => item.id)
    if (previousShiftIds.length > 0) {
      const previousCount = await this.reports.countDocuments({
        tenantId: tenant.tenantId,
        businessDate: today,
        shiftId: { $in: previousShiftIds },
        effective: { $ne: false },
        status: ReportStatus.SUBMITTED,
      })
      if (previousCount !== previousShiftIds.length) throw new InvalidInputException('Submit the previous shift report first.')
    }

    const databaseSession = await this.connection.startSession()
    let created: ReportRecord | undefined
    let didCreate = false
    try {
      await databaseSession.withTransaction(async () => {
        const winner = await this.reports.findOne(activeFilter).session(databaseSession).lean<ReportRecord>().exec()
        if (winner) {
          created = winner
          return
        }
        const [document] = await this.reports.create([{
          ...slotFilter,
          interval: { startTime: shift.startTime, endTime: shift.endTime, timezone: tenant.timezone },
          currency: tenant.currency,
          creatorId: actor.userId,
          creatorName: actor.name,
          status: ReportStatus.DRAFT,
          effective: true,
          incomeEntries: tenant.recurringIncomeFields
            .filter((field) => field.active)
            .map((field) => ({
              id: randomUUID(),
              recurringIncomeFieldId: field.id,
              description: field.description,
              amount: decimal128('0'),
            })),
        }], { session: databaseSession })
        if (!document) throw new ConflictException('Unable to create the report.')
        const batch = await this.disposals.initializeForReport({
          tenantId: tenant.tenantId,
          reportId: document._id,
          businessDate: today,
          shiftId: shift.id,
        }, databaseSession)
        document.disposalBatchId = batch._id
        await document.save({ session: databaseSession })
        created = document.toObject<ReportRecord>()
        didCreate = true
      })
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error
      created = await this.reports.findOne(activeFilter).lean<ReportRecord>().exec() ?? undefined
    } finally {
      await databaseSession.endSession()
    }
    if (!created) throw new ConflictException('The report slot was claimed by another request.')
    if (didCreate) {
      await this.events.emitAsync(REPORT_CREATED_EVENT, new ReportCreatedEvent(tenant.tenantId, actor.userId, created._id, created.createdAt))
    }
    return { report: created, created: didCreate }
  }

  async get(tenantId: Types.ObjectId, reportId: Types.ObjectId): Promise<ReportRecord> {
    const report = await this.reports.findOne({ _id: reportId, tenantId }).lean<ReportRecord>().exec()
    if (!report) throw new NotFoundException('Report not found.')
    return report
  }

  async getDetail(tenantId: Types.ObjectId, reportId: Types.ObjectId): Promise<ReportDetailRecord> {
    const report = await this.get(tenantId, reportId)
    const disposals = report.disposalBatchId ? await this.disposals.getForReport(tenantId, reportId) : undefined
    return { report, disposals: disposals ?? undefined }
  }

  async list(tenantId: Types.ObjectId, input: ReportsInput) {
    const filter = {
      tenantId,
      ...(input.startDate && input.endDate
        ? { businessDate: { $gte: input.startDate, $lte: input.endDate } }
        : {}),
      ...(input.submittedOnly
        ? { status: ReportStatus.SUBMITTED, effective: { $ne: false } }
        : {}),
    }
    const [items, totalCount] = await Promise.all([
      this.reports.find(filter).sort({ businessDate: -1, createdAt: -1, _id: -1 }).skip(input.offset).limit(input.limit).lean<ReportRecord[]>().exec(),
      this.reports.countDocuments(filter).exec(),
    ])
    return { items, totalCount }
  }

  async saveDraft(tenantId: Types.ObjectId, actor: ReportActor, input: SaveReportDraftInput): Promise<ReportDetailRecord> {
    this.assertUniqueEntryIds(input)
    const databaseSession = await this.connection.startSession()
    let result: ReportDetailRecord | undefined
    try {
      await databaseSession.withTransaction(async () => {
        const current = await this.reports.findOne({ _id: input.reportId, tenantId, effective: true }).session(databaseSession).lean<ReportRecord>().exec()
        if (!current) throw new NotFoundException('Report not found.')
        this.assertAuthorized(current, actor, 'edit')
        if (current.status !== ReportStatus.DRAFT) throw new ConflictException('Only draft reports can be changed.')
        if (current.revision !== input.expectedReportRevision) throw new ConflictException('This report changed. Refresh and try again.')

        const incomeEntries = toIncomeEntries(current, input.incomeEntries)
        const expenseEntries = toEntries(input.expenseEntries)
        const lubricantSales = input.lubricantSales === undefined
          ? current.lubricantSales ?? []
          : await this.inventory.snapshotSales(
            tenantId,
            current.lubricantSales ?? [],
            input.lubricantSales,
            databaseSession,
          )
        const disposalBatch = await this.disposals.saveDraft(
          tenantId,
          input.reportId,
          input.expectedDisposalRevision,
          input.disposalReadings,
          databaseSession,
        )
        const income = sum(incomeEntries.map((entry) => entry.amount.toString()))
        const expenses = sum(expenseEntries.map((entry) => entry.amount.toString()))
        const cashFuelSales = income.plus(expenses)
        const lubricantSalesTotal = sum(lubricantSales.map((sale) => sale.amount.toString()))
        const pumpSales = disposalBatch.pumpSales ? decimal(disposalBatch.pumpSales) : undefined
        const updated = await this.reports.findOneAndUpdate(
          { _id: input.reportId, tenantId, effective: true, status: ReportStatus.DRAFT, revision: input.expectedReportRevision },
          {
            $set: {
              incomeEntries,
              expenseEntries,
              lubricantSales,
              totals: {
                income: decimal128(income),
                expenses: decimal128(expenses),
                cashFuelSales: decimal128(cashFuelSales),
                lubricantSales: decimal128(lubricantSalesTotal),
                ...(pumpSales ? { pumpSales: decimal128(pumpSales), overShort: decimal128(cashFuelSales.minus(pumpSales)) } : {}),
              },
            },
            $inc: { revision: 1 },
          },
          { new: true, runValidators: true, session: databaseSession },
        ).lean<ReportRecord>().exec()
        if (!updated) throw new ConflictException('This report changed. Refresh and try again.')
        result = { report: updated, disposals: disposalBatch }
      })
    } finally {
      await databaseSession.endSession()
    }
    if (!result) throw new ConflictException('Unable to save this report.')
    return result
  }

  async submit(tenantId: Types.ObjectId, actor: ReportActor, input: ReportTransitionInput): Promise<ReportDetailRecord> {
    const databaseSession = await this.connection.startSession()
    let result: ReportDetailRecord | undefined
    try {
      await databaseSession.withTransaction(async () => {
        const current = await this.reports.findOne({ _id: input.reportId, tenantId, effective: true }).session(databaseSession).lean<ReportRecord>().exec()
        if (!current) throw new NotFoundException('Report not found.')
        this.assertAuthorized(current, actor, 'edit')
        if (current.status !== ReportStatus.DRAFT || current.revision !== input.expectedReportRevision) throw new ConflictException('This report changed or has already been submitted.')
        const now = new Date()
        const disposalBatch = await this.disposals.submitBatch(tenantId, input.reportId, input.expectedDisposalRevision, now, databaseSession)
        if (!disposalBatch.pumpSales) throw new InvalidInputException('Complete every disposal reading before submitting.')
        await this.stockMovements.applyReportSales(
          tenantId,
          current._id,
          current.lubricantSales ?? [],
          actor,
          databaseSession,
        )
        const cashFuelSales = decimal(current.totals.cashFuelSales)
        const pumpSales = decimal(disposalBatch.pumpSales)
        const updated = await this.reports.findOneAndUpdate(
          { _id: input.reportId, tenantId, effective: true, status: ReportStatus.DRAFT, revision: input.expectedReportRevision },
          {
            $set: {
              status: ReportStatus.SUBMITTED,
              submittedAt: now,
              submittedById: actor.userId,
              submittedByName: actor.name,
              'totals.pumpSales': disposalBatch.pumpSales,
              'totals.overShort': decimal128(cashFuelSales.minus(pumpSales)),
            },
            $inc: { revision: 1 },
          },
          { new: true, runValidators: true, session: databaseSession },
        ).lean<ReportRecord>().exec()
        if (!updated) throw new ConflictException('This report changed. Refresh and try again.')
        result = { report: updated, disposals: disposalBatch }
      })
    } finally {
      await databaseSession.endSession()
    }
    if (!result) throw new ConflictException('Unable to submit this report.')
    return result
  }

  async delete(tenantId: Types.ObjectId, actor: ReportActor, input: DeleteReportInput): Promise<ReportDetailRecord> {
    const databaseSession = await this.connection.startSession()
    let result: ReportDetailRecord | undefined
    try {
      await databaseSession.withTransaction(async () => {
        const current = await this.reports.findOne({ _id: input.reportId, tenantId, effective: true }).session(databaseSession).lean<ReportRecord>().exec()
        if (!current) throw new NotFoundException('Report not found.')
        this.assertAuthorized(current, actor, 'delete')
        if (current.revision !== input.expectedReportRevision) throw new ConflictException('This report changed. Refresh and try again.')
        if (![ReportStatus.DRAFT, ReportStatus.SUBMITTED].includes(current.status)) throw new ConflictException('This report is already revoked.')
        const now = new Date()
        const disposalBatch = await this.disposals.revokeForReport(
          tenantId,
          input.reportId,
          input.expectedDisposalRevision,
          actor,
          input.reason,
          now,
          databaseSession,
        )
        if (current.status === ReportStatus.SUBMITTED) {
          await this.stockMovements.reverseReportSales(
            tenantId,
            current._id,
            current.lubricantSales ?? [],
            actor,
            databaseSession,
          )
        }
        const updated = await this.reports.findOneAndUpdate(
          { _id: input.reportId, tenantId, effective: true, revision: input.expectedReportRevision },
          {
            $set: {
              status: ReportStatus.REVOKED,
              effective: false,
              revokedFromStatus: current.status,
              revokedAt: now,
              revokedById: actor.userId,
              revokedByName: actor.name,
              revocationReason: input.reason,
            },
            $inc: { revision: 1 },
          },
          { new: true, runValidators: true, session: databaseSession },
        ).lean<ReportRecord>().exec()
        if (!updated) throw new ConflictException('This report changed. Refresh and try again.')
        result = { report: updated, disposals: disposalBatch }
      })
    } finally {
      await databaseSession.endSession()
    }
    if (!result) throw new ConflictException('Unable to delete this report.')
    return result
  }

  async deleteForTenant(tenantId: Types.ObjectId, session: ClientSession) {
    const disposals = await this.disposals.deleteForTenant(tenantId, session)
    const reports = await this.reports.deleteMany({ tenantId }, { session })
    return { reports: reports.deletedCount, disposalBatches: disposals.batches, meterHeads: disposals.heads }
  }

  private assertAuthorized(report: ReportRecord, actor: ReportActor, action: 'edit' | 'delete') {
    const administrator = actor.role === UserRole.ADMIN || actor.role === UserRole.SUPERADMIN
    if (!administrator && !report.creatorId.equals(actor.userId)) {
      throw new ForbiddenException(`Only the report creator or an administrator can ${action} this report.`)
    }
  }

  private assertUniqueEntryIds(input: SaveReportDraftInput) {
    const ids = [...input.incomeEntries, ...input.expenseEntries].map((entry) => entry.id)
    if (new Set(ids).size !== ids.length) throw new InvalidInputException('Financial entry identifiers must be unique.')
    const lubricantIds = (input.lubricantSales ?? []).map((sale) => sale.id)
    if (new Set(lubricantIds).size !== lubricantIds.length) throw new InvalidInputException('Lubricant sale identifiers must be unique.')
  }
}

function toEntries(entries: SaveReportDraftInput['incomeEntries']): ReportFinancialEntry[] {
  return entries.map((entry) => ({
    id: entry.id,
    description: entry.description,
    notes: entry.notes || undefined,
    amount: decimal128(entry.amount),
  }))
}

function toIncomeEntries(
  current: ReportRecord,
  entries: SaveReportDraftInput['incomeEntries'],
): ReportFinancialEntry[] {
  const configured = (current.incomeEntries ?? []).filter((entry) => entry.recurringIncomeFieldId)
  const configuredIds = new Set(configured.map((entry) => entry.id))
  const submittedById = new Map(entries.map((entry) => [entry.id, entry]))
  const protectedEntries = configured.map((entry) => {
    const submitted = submittedById.get(entry.id)
    if (!submitted) {
      throw new InvalidInputException('Configured income fields cannot be removed.')
    }
    if (
      submitted.description !== entry.description ||
      (submitted.notes || undefined) !== (entry.notes || undefined)
    ) {
      throw new InvalidInputException('Configured income field details cannot be changed in a report.')
    }
    return {
      id: entry.id,
      recurringIncomeFieldId: entry.recurringIncomeFieldId,
      description: entry.description,
      notes: entry.notes,
      amount: decimal128(submitted.amount),
    }
  })

  const customEntries = entries
    .filter((entry) => !configuredIds.has(entry.id))
    .map((entry) => {
      if (decimal(entry.amount).isZero()) {
        throw new InvalidInputException('Custom income amounts must be greater than zero.')
      }
      return {
        id: entry.id,
        description: entry.description,
        notes: entry.notes || undefined,
        amount: decimal128(entry.amount),
      }
    })

  return [...protectedEntries, ...customEntries]
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000
}

function sortShifts(shifts: Shift[]): Shift[] {
  return [...shifts].sort((left, right) =>
    left.startTime.localeCompare(right.startTime) || left.endTime.localeCompare(right.endTime) || left.id.toHexString().localeCompare(right.id.toHexString()),
  )
}
