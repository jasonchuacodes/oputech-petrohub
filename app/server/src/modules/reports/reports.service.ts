import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import Decimal from 'decimal.js'
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
import { ChangeFuelPriceInput } from '../fuel-setup/fuel-setup.schemas'
import { FuelProductRecord, FuelSetupService } from '../fuel-setup/fuel-setup.service'
import { REPORT_CREATED_EVENT, ReportCreatedEvent } from './events/report-created.event'
import { businessDateFor } from './report-date'
import { displayTime, localHourToInstant, ReportInterval, shiftInterval } from './report-time'
import {
  CreateReportInput,
  DeleteReportInput,
  FinancialSummaryInput,
  ReportsInput,
  ReportTransitionInput,
  SaveReportDraftInput,
  UpdateReportRemarksInput,
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

export type FinancialBucketInterval = 'day' | 'week' | 'month'

type FinancialAmounts = {
  income: Decimal
  expenses: Decimal
  lubricantSales: Decimal
}

export type FinancialSummaryResult = {
  startDate: string
  endDate: string
  bucketInterval: FinancialBucketInterval
  includedReportCount: number
  totals: FinancialAmounts
  buckets: Array<{
    startDate: string
    endDate: string
    amounts: FinancialAmounts
  }>
}

type FinancialDayAggregate = {
  _id: string
  income: Types.Decimal128
  expenses: Types.Decimal128
  lubricantSales: Types.Decimal128
  reportCount: number
}

type DynamicReportSlot = {
  id: string
  shift: Shift
  interval: ReportInterval
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly reports: Model<Report>,
    @InjectConnection() private readonly connection: Connection,
    private readonly disposals: DisposalsService,
    private readonly inventory: InventoryService,
    private readonly stockMovements: StockMovementService,
    private readonly fuelSetup: FuelSetupService,
    private readonly events: EventEmitter2,
  ) {}

  async creationContext(tenant: ReportTenant) {
    const businessDate = businessDateFor(tenant.timezone)
    const [reports, dynamicSlots] = await Promise.all([
      this.reports
      .find({ tenantId: tenant.tenantId, businessDate, effective: { $ne: false } })
      .sort({ 'interval.startAt': 1, createdAt: 1 })
      .lean<ReportRecord[]>()
      .exec(),
      this.dynamicSlots(tenant, businessDate),
    ])
    const bySlot = new Map(reports.map((report) => [report.slotId, report]))
    const configuredIds = new Set(dynamicSlots.map((slot) => slot.id))
    let previousSubmitted = true
    const slots = dynamicSlots.map((slot) => {
      const report = bySlot.get(slot.id)
      const canCreate = !report && previousSubmitted
      const blockedReason = report
        ? undefined
        : previousSubmitted
          ? undefined
          : 'Submit the previous report period first.'
      if (!report || report.status !== ReportStatus.SUBMITTED || report.stale) previousSubmitted = false
      return {
        ...slot,
        shift: report ? { ...slot.shift, name: report.shiftName } : slot.shift,
        report,
        canCreate,
        blockedReason,
      }
    })
    const removed = reports.filter((report) => !configuredIds.has(report.slotId)).map((report) => ({
      id: report.slotId,
      shift: { id: report.shiftId, name: report.shiftName, startTime: report.interval.startTime, endTime: report.interval.endTime },
      interval: report.interval,
      report,
      canCreate: false,
      blockedReason: undefined,
    }))
    return { businessDate, slots: [...slots, ...removed] }
  }

  async createOrOpen(tenant: ReportTenant, actor: ReportActor, input: CreateReportInput) {
    const today = businessDateFor(tenant.timezone)
    if (input.businessDate !== today) throw new InvalidInputException('Reports can only be created for today.')
    const slotFilter = { tenantId: tenant.tenantId, businessDate: today, slotId: input.slotId }
    const activeFilter = { ...slotFilter, effective: { $ne: false } }
    const existing = await this.reports.findOne(activeFilter).lean<ReportRecord>().exec()
    if (existing) return { report: existing, created: false }

    const databaseSession = await this.connection.startSession()
    let created: ReportRecord | undefined
    let didCreate = false
    try {
      await databaseSession.withTransaction(async () => {
        await this.fuelSetup.lockPricePlan(tenant.tenantId, databaseSession)
        const winner = await this.reports.findOne(activeFilter).session(databaseSession).lean<ReportRecord>().exec()
        if (winner) {
          created = winner
          return
        }
        const slots = await this.dynamicSlots(tenant, today, databaseSession)
        const slotIndex = slots.findIndex((slot) => slot.id === input.slotId)
        const slot = slots[slotIndex]
        if (!slot) throw new InvalidInputException('Select an available report period.')
        const previousSlotIds = slots.slice(0, slotIndex).map((item) => item.id)
        if (previousSlotIds.length > 0) {
          const previousCount = await this.reports.countDocuments({
            tenantId: tenant.tenantId,
            businessDate: today,
            slotId: { $in: previousSlotIds },
            effective: { $ne: false },
            status: ReportStatus.SUBMITTED,
            stale: false,
          }).session(databaseSession)
          if (previousCount !== previousSlotIds.length) {
            throw new InvalidInputException('Submit the previous report period first.')
          }
        }
        const [document] = await this.reports.create([{
          ...slotFilter,
          shiftId: slot.shift.id,
          shiftName: slot.shift.name,
          interval: slot.interval,
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
          shiftId: slot.shift.id,
          intervalStartAt: slot.interval.startAt,
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

  async changeFuelPrice(
    tenant: Pick<ReportTenant, 'tenantId' | 'timezone'>,
    actorId: Types.ObjectId,
    input: ChangeFuelPriceInput,
  ): Promise<FuelProductRecord> {
    const today = businessDateFor(tenant.timezone)
    if (input.effectiveDate < today) {
      throw new InvalidInputException('Fuel prices cannot be backdated before the current business date.')
    }
    const effectiveAt = localHourToInstant(input.effectiveDate, input.effectiveHour, tenant.timezone)
    const databaseSession = await this.connection.startSession()
    let result: FuelProductRecord | undefined
    try {
      await databaseSession.withTransaction(async () => {
        await this.fuelSetup.lockPricePlan(tenant.tenantId, databaseSession)
        const changed = await this.fuelSetup.changePrice(
          tenant.tenantId,
          actorId,
          input,
          effectiveAt,
          databaseSession,
        )
        result = changed.product
        if (!changed.changed) return

        const submitted = await this.reports.exists({
          tenantId: tenant.tenantId,
          effective: true,
          status: ReportStatus.SUBMITTED,
          'interval.startAt': { $lte: effectiveAt },
          'interval.endAt': { $gt: effectiveAt },
        }).session(databaseSession)
        if (submitted) {
          throw new ConflictException('A submitted report already covers this effective hour. Revert it before changing the price.')
        }

        await this.reports.updateMany(
          {
            tenantId: tenant.tenantId,
            effective: true,
            status: ReportStatus.DRAFT,
            stale: false,
            'interval.startAt': { $lte: effectiveAt },
            'interval.endAt': { $gt: effectiveAt },
          },
          { $set: { stale: true }, $inc: { revision: 1 } },
          { session: databaseSession },
        )
      })
    } finally {
      await databaseSession.endSession()
    }
    if (!result) throw new ConflictException('Unable to change the fuel price.')
    return result
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

  async financialSummary(
    tenantId: Types.ObjectId,
    input: FinancialSummaryInput,
  ): Promise<FinancialSummaryResult> {
    const zero = Types.Decimal128.fromString('0')
    const days = await this.reports.aggregate<FinancialDayAggregate>([
      {
        $match: {
          tenantId,
          status: ReportStatus.SUBMITTED,
          effective: { $ne: false },
          businessDate: { $gte: input.startDate, $lte: input.endDate },
        },
      },
      {
        $group: {
          _id: '$businessDate',
          income: { $sum: { $ifNull: ['$totals.income', zero] } },
          expenses: { $sum: { $ifNull: ['$totals.expenses', zero] } },
          lubricantSales: { $sum: { $ifNull: ['$totals.lubricantSales', zero] } },
          reportCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]).exec()

    const bucketInterval = financialBucketInterval(input.startDate, input.endDate)
    const buckets = buildFinancialBuckets(input.startDate, input.endDate, bucketInterval, days)
    const totals = buckets.reduce(
      (result, bucket) => addFinancialAmounts(result, bucket.amounts),
      emptyFinancialAmounts(),
    )

    return {
      ...input,
      bucketInterval,
      includedReportCount: days.reduce((total, day) => total + day.reportCount, 0),
      totals,
      buckets,
    }
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

  async updateRemarks(tenantId: Types.ObjectId, actor: ReportActor, input: UpdateReportRemarksInput): Promise<ReportDetailRecord> {
    const current = await this.reports.findOne({ _id: input.reportId, tenantId }).lean<ReportRecord>().exec()
    if (!current) throw new NotFoundException('Report not found.')

    const administrator = actor.role === UserRole.ADMIN || actor.role === UserRole.SUPERADMIN
    const creator = current.creatorId.equals(actor.userId)
    if (current.status === ReportStatus.REVOKED) throw new ConflictException('Revoked reports cannot be changed.')
    if (!administrator && (!creator || current.status !== ReportStatus.DRAFT)) {
      throw new ForbiddenException('Only the report creator can edit draft remarks; administrators can also edit submitted remarks.')
    }
    if (current.revision !== input.expectedRevision) throw new ConflictException('This report changed. Refresh and try again.')

    const updated = await this.reports.findOneAndUpdate(
      {
        _id: input.reportId,
        tenantId,
        revision: input.expectedRevision,
        status: { $in: [ReportStatus.DRAFT, ReportStatus.SUBMITTED] },
      },
      { $set: { remarks: input.remarks }, $inc: { revision: 1 } },
      { new: true, runValidators: true },
    ).lean<ReportRecord>().exec()
    if (!updated) throw new ConflictException('This report changed. Refresh and try again.')
    const disposals = updated.disposalBatchId ? await this.disposals.getForReport(tenantId, updated._id) : undefined
    return { report: updated, disposals: disposals ?? undefined }
  }

  async submit(tenantId: Types.ObjectId, actor: ReportActor, input: ReportTransitionInput): Promise<ReportDetailRecord> {
    const databaseSession = await this.connection.startSession()
    let result: ReportDetailRecord | undefined
    try {
      await databaseSession.withTransaction(async () => {
        await this.fuelSetup.lockPricePlan(tenantId, databaseSession)
        const current = await this.reports.findOne({ _id: input.reportId, tenantId, effective: true }).session(databaseSession).lean<ReportRecord>().exec()
        if (!current) throw new NotFoundException('Report not found.')
        this.assertAuthorized(current, actor, 'edit')
        if (current.status !== ReportStatus.DRAFT || current.revision !== input.expectedReportRevision) throw new ConflictException('This report changed or has already been submitted.')
        if (current.stale) throw new ConflictException('Fuel prices changed during this report period. Revert and recreate the report.')
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

  private async dynamicSlots(
    tenant: Pick<ReportTenant, 'tenantId' | 'timezone' | 'shifts'>,
    businessDate: string,
    session?: ClientSession,
  ): Promise<DynamicReportSlot[]> {
    const slots: DynamicReportSlot[] = []
    for (const shift of tenant.shifts) {
      const scheduled = shiftInterval(businessDate, shift, tenant.timezone)
      const boundaries = await this.fuelSetup.priceBoundaries(
        tenant.tenantId,
        scheduled.startAt,
        scheduled.endAt,
        session,
      )
      const points = [scheduled.startAt, ...boundaries, scheduled.endAt]
      for (let index = 0; index < points.length - 1; index += 1) {
        const startAt = points[index]
        const endAt = points[index + 1]
        if (!startAt || !endAt) continue
        slots.push({
          id: `${shift.id.toHexString()}:${startAt.toISOString()}`,
          shift,
          interval: {
            startAt,
            endAt,
            startTime: displayTime(tenant.timezone, startAt),
            endTime: displayTime(tenant.timezone, endAt),
            timezone: tenant.timezone,
          },
        })
      }
    }
    return slots.sort((left, right) => left.interval.startAt.getTime() - right.interval.startAt.getTime())
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

function financialBucketInterval(startDate: string, endDate: string): FinancialBucketInterval {
  const days = inclusiveDayCount(startDate, endDate)
  if (days <= 31) return 'day'
  if (days <= 180) return 'week'
  return 'month'
}

function buildFinancialBuckets(
  startDate: string,
  endDate: string,
  interval: FinancialBucketInterval,
  days: FinancialDayAggregate[],
): FinancialSummaryResult['buckets'] {
  const amountsByDate = new Map(
    days.map((day) => [day._id, {
      income: decimal(day.income),
      expenses: decimal(day.expenses),
      lubricantSales: decimal(day.lubricantSales),
    }]),
  )
  const buckets: FinancialSummaryResult['buckets'] = []
  let bucketStart = startDate

  while (bucketStart <= endDate) {
    const naturalEnd = interval === 'day'
      ? bucketStart
      : interval === 'week'
        ? endOfWeek(bucketStart)
        : endOfMonth(bucketStart)
    const bucketEnd = naturalEnd < endDate ? naturalEnd : endDate
    let amounts = emptyFinancialAmounts()
    for (let date = bucketStart; date <= bucketEnd; date = addDays(date, 1)) {
      amounts = addFinancialAmounts(amounts, amountsByDate.get(date) ?? emptyFinancialAmounts())
    }
    buckets.push({ startDate: bucketStart, endDate: bucketEnd, amounts })
    bucketStart = addDays(bucketEnd, 1)
  }

  return buckets
}

function emptyFinancialAmounts(): FinancialAmounts {
  return { income: new Decimal(0), expenses: new Decimal(0), lubricantSales: new Decimal(0) }
}

function addFinancialAmounts(left: FinancialAmounts, right: FinancialAmounts): FinancialAmounts {
  return {
    income: left.income.plus(right.income),
    expenses: left.expenses.plus(right.expenses),
    lubricantSales: left.lubricantSales.plus(right.lubricantSales),
  }
}

function inclusiveDayCount(startDate: string, endDate: string): number {
  return Math.floor((dateValue(endDate) - dateValue(startDate)) / 86_400_000) + 1
}

function endOfWeek(date: string): string {
  const weekday = new Date(dateValue(date)).getUTCDay()
  const daysSinceMonday = (weekday + 6) % 7
  return addDays(date, 6 - daysSinceMonday)
}

function endOfMonth(date: string): string {
  const [year, month] = parseDate(date)
  const end = new Date(Date.UTC(year, month, 0))
  return formatDate(end.getUTCFullYear(), end.getUTCMonth() + 1, end.getUTCDate())
}

function addDays(date: string, amount: number): string {
  const next = new Date(dateValue(date) + amount * 86_400_000)
  return formatDate(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate())
}

function dateValue(date: string): number {
  const [year, month, day] = parseDate(date)
  return Date.UTC(year, month - 1, day)
}

function parseDate(date: string): [number, number, number] {
  return date.split('-').map(Number) as [number, number, number]
}

function formatDate(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
