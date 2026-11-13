import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Types } from 'mongoose'
import type { Mutation as GraphqlMutation, Query as GraphqlQuery } from '../../generated/graphql'
import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe'
import { decimalString } from '../../common/numeric/decimal'
import { AuthorizedTenant, AuthenticatedActor } from '../auth/auth.types'
import { CurrentActor } from '../auth/decorators/current-actor.decorator'
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator'
import { RequireRoles, RolesGuard } from '../auth/guards/roles.guard'
import { TenantAccessGuard } from '../auth/guards/tenant-access.guard'
import { AccessTokenGuard } from '../auth/session/guards/access-token.guard'
import { DisposalBatchRecord } from '../disposals/disposals.service'
import { UserRole } from '../users/schemas/user.schema'
import {
  createReportInputSchema,
  CreateReportInput,
  deleteReportInputSchema,
  DeleteReportInput,
  financialSummaryInputSchema,
  FinancialSummaryInput,
  reportInputSchema,
  ReportInput,
  reportsInputSchema,
  ReportsInput,
  reportTransitionInputSchema,
  ReportTransitionInput,
  saveReportDraftInputSchema,
  SaveReportDraftInput,
  updateReportRemarksInputSchema,
  UpdateReportRemarksInput,
} from './reports.schemas'
import { ReportDetailRecord, ReportRecord, ReportsService } from './reports.service'

const tenantGuards = [AccessTokenGuard, TenantAccessGuard]
const roleGuards = [...tenantGuards, RolesGuard]

@Resolver()
export class ReportsResolver {
  constructor(private readonly reports: ReportsService) {}

  @Query('reportCreationContext')
  @UseGuards(...tenantGuards)
  async creationContext(@CurrentTenant() tenant: AuthorizedTenant): Promise<GraphqlQuery['reportCreationContext']> {
    const context = await this.reports.creationContext(this.toTenant(tenant))
    return {
      businessDate: context.businessDate,
      slots: context.slots.map(({ id, shift, interval, report, canCreate, blockedReason }) => ({
        id,
        shift: { id: shift.id, name: shift.name, startTime: shift.startTime, endTime: shift.endTime },
        interval: this.serializeInterval(interval),
        report: report ? this.serialize(report) : null,
        canCreate,
        blockedReason,
      })),
    }
  }

  @Query('report')
  @UseGuards(...tenantGuards)
  async report(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(reportInputSchema)) input: ReportInput,
  ): Promise<GraphqlQuery['report']> {
    return this.serializeDetail(await this.reports.getDetail(tenant.tenantId, input.reportId))
  }

  @Query('reports')
  @UseGuards(...tenantGuards)
  async list(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(reportsInputSchema)) input: ReportsInput,
  ): Promise<GraphqlQuery['reports']> {
    const page = await this.reports.list(tenant.tenantId, input)
    return { items: page.items.map((detail) => this.serializeDetail(detail)), totalCount: page.totalCount }
  }

  @Query('financialSummary')
  @UseGuards(...roleGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async financialSummary(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(financialSummaryInputSchema)) input: FinancialSummaryInput,
  ): Promise<GraphqlQuery['financialSummary']> {
    const summary = await this.reports.financialSummary(tenant.tenantId, input)
    return {
      ...summary,
      timezone: tenant.tenant.timezone,
      currency: tenant.tenant.currency,
      totals: this.serializeFinancialAmounts(summary.totals),
      buckets: summary.buckets.map((bucket) => ({
        ...bucket,
        amounts: this.serializeFinancialAmounts(bucket.amounts),
      })),
    }
  }

  @Mutation('createReport')
  @UseGuards(...roleGuards)
  @RequireRoles(UserRole.MEMBER)
  async create(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(createReportInputSchema)) input: CreateReportInput,
  ): Promise<GraphqlMutation['createReport']> {
    const result = await this.reports.createOrOpen(this.toTenant(tenant), this.toActor(actor), input)
    const detail = await this.reports.getDetail(tenant.tenantId, result.report._id)
    return { created: result.created, report: this.serializeDetail(detail) }
  }

  @Mutation('saveReportDraft')
  @UseGuards(...tenantGuards)
  async save(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(saveReportDraftInputSchema)) input: SaveReportDraftInput,
  ): Promise<GraphqlMutation['saveReportDraft']> {
    return this.serializeDetail(await this.reports.saveDraft(tenant.tenantId, this.toActor(actor), input))
  }

  @Mutation('updateReportRemarks')
  @UseGuards(...tenantGuards)
  async updateRemarks(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(updateReportRemarksInputSchema)) input: UpdateReportRemarksInput,
  ): Promise<GraphqlMutation['updateReportRemarks']> {
    return this.serializeDetail(await this.reports.updateRemarks(tenant.tenantId, this.toActor(actor), input))
  }

  @Mutation('submitReport')
  @UseGuards(...tenantGuards)
  async submit(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(reportTransitionInputSchema)) input: ReportTransitionInput,
  ): Promise<GraphqlMutation['submitReport']> {
    return this.serializeDetail(await this.reports.submit(tenant.tenantId, this.toActor(actor), input))
  }

  @Mutation('deleteReport')
  @UseGuards(...tenantGuards)
  async delete(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(deleteReportInputSchema)) input: DeleteReportInput,
  ): Promise<GraphqlMutation['deleteReport']> {
    return this.serializeDetail(await this.reports.delete(tenant.tenantId, this.toActor(actor), input))
  }

  private toTenant(tenant: AuthorizedTenant) {
    return {
      tenantId: tenant.tenantId,
      timezone: tenant.tenant.timezone,
      currency: tenant.tenant.currency,
      shifts: tenant.tenant.shifts ?? [],
      recurringIncomeFields: tenant.tenant.recurringIncomeFields ?? [],
    }
  }

  private toActor(actor: AuthenticatedActor) {
    return { userId: actor.userId, name: actor.user.fullName || actor.user.username, role: actor.user.role }
  }

  private serializeDetail(detail: ReportDetailRecord) {
    return this.serialize(detail.report, detail.disposals)
  }

  private serialize(report: ReportRecord, disposals?: DisposalBatchRecord) {
    const totals = report.totals ?? {
      income: Types.Decimal128.fromString('0'),
      expenses: Types.Decimal128.fromString('0'),
      cashFuelSales: Types.Decimal128.fromString('0'),
    }
    return {
      id: report._id,
      businessDate: report.businessDate,
      shiftId: report.shiftId,
      shiftName: report.shiftName,
      interval: this.serializeInterval(report.interval),
      currency: report.currency ?? 'PHP',
      legacy: !report.disposalBatchId,
      effective: report.effective ?? report.status !== 'revoked',
      stale: report.stale,
      incomeEntries: (report.incomeEntries ?? []).map((entry) => ({
        ...entry,
        recurringIncomeFieldId: entry.recurringIncomeFieldId ?? null,
        amount: entry.amount.toString(),
      })),
      expenseEntries: (report.expenseEntries ?? []).map((entry) => ({
        ...entry,
        recurringIncomeFieldId: entry.recurringIncomeFieldId ?? null,
        amount: entry.amount.toString(),
      })),
      lubricantSales: (report.lubricantSales ?? []).map((sale) => ({
        ...sale,
        quantity: sale.quantity.toString(),
        unitPrice: sale.unitPrice.toString(),
        amount: sale.amount.toString(),
      })),
      remarks: report.remarks ?? '',
      totals: {
        income: totals.income.toString(),
        expenses: totals.expenses.toString(),
        cashFuelSales: totals.cashFuelSales.toString(),
        pumpSales: decimalString(totals.pumpSales),
        overShort: decimalString(totals.overShort),
        lubricantSales: totals.lubricantSales?.toString() ?? '0',
      },
      disposals: disposals ? this.serializeDisposals(disposals) : null,
      creatorId: report.creatorId,
      creatorName: report.creatorName,
      status: report.status,
      revision: report.revision,
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
      submittedAt: report.submittedAt?.toISOString(),
      submittedById: report.submittedById,
      submittedByName: report.submittedByName,
      revokedFromStatus: report.revokedFromStatus,
      revokedAt: report.revokedAt?.toISOString(),
      revokedById: report.revokedById,
      revokedByName: report.revokedByName,
      revocationReason: report.revocationReason,
    }
  }

  private serializeDisposals(batch: DisposalBatchRecord) {
    return {
      id: batch._id,
      revision: batch.revision,
      status: batch.status,
      predecessorBatchId: batch.predecessorBatchId,
      successorBatchId: batch.successorBatchId,
      readings: batch.readings.map((reading) => ({
        meterId: reading.meterId,
        meterLabel: reading.meterLabel,
        productId: reading.productId,
        productName: reading.productName,
        unitPrice: reading.unitPrice.toString(),
        openingReading: reading.openingReading.toString(),
        openingSource: reading.openingSourceBatchId ? 'previous_report' as const : 'baseline' as const,
        closingReading: decimalString(reading.closingReading),
        calibration: reading.calibration.toString(),
        netVolume: decimalString(reading.netVolume),
        sales: decimalString(reading.sales),
      })),
      pumpSales: decimalString(batch.pumpSales),
      complete: batch.complete,
      blockingIssues: batch.blockingIssues,
    }
  }

  private serializeFinancialAmounts(amounts: {
    income: { toString(): string }
    expenses: { toString(): string }
    lubricantSales: { toString(): string }
  }) {
    return {
      income: amounts.income.toString(),
      expenses: amounts.expenses.toString(),
      lubricantSales: amounts.lubricantSales.toString(),
    }
  }

  private serializeInterval(interval: ReportRecord['interval']) {
    return {
      startTime: interval.startTime,
      endTime: interval.endTime,
      timezone: interval.timezone,
      startAt: interval.startAt.toISOString(),
      endAt: interval.endAt.toISOString(),
    }
  }
}
