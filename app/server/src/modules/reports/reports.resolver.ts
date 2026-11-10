import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { Mutation as GraphqlMutation, Query as GraphqlQuery } from '../../generated/graphql'
import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe'
import { AuthenticatedActor, AuthorizedTenant } from '../auth/auth.types'
import { CurrentActor } from '../auth/decorators/current-actor.decorator'
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator'
import { RequireRoles, RolesGuard } from '../auth/guards/roles.guard'
import { TenantAccessGuard } from '../auth/guards/tenant-access.guard'
import { AccessTokenGuard } from '../auth/session/guards/access-token.guard'
import { UserRole } from '../users/schemas/user.schema'
import {
  createReportInputSchema,
  CreateReportInput,
  reportInputSchema,
  ReportInput,
  reportsInputSchema,
  ReportsInput,
  reportRevisionInputSchema,
  ReportRevisionInput,
} from './reports.schemas'
import { ReportRecord, ReportsService } from './reports.service'

const tenantGuards = [AccessTokenGuard, TenantAccessGuard]
const roleGuards = [...tenantGuards, RolesGuard]

@Resolver()
export class ReportsResolver {
  constructor(private readonly reports: ReportsService) {}

  @Query('reportCreationContext')
  @UseGuards(...tenantGuards)
  async creationContext(
    @CurrentTenant() tenant: AuthorizedTenant,
  ): Promise<GraphqlQuery['reportCreationContext']> {
    const context = await this.reports.creationContext(this.toTenant(tenant))
    return {
      businessDate: context.businessDate,
      slots: context.slots.map(({ shift, report, canCreate, blockedReason }) => ({
        shift: {
          id: shift.id,
          startTime: shift.startTime,
          endTime: shift.endTime,
        },
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
    return this.serialize(await this.reports.get(tenant.tenantId, input.reportId))
  }

  @Query('reports')
  @UseGuards(...tenantGuards)
  async list(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(reportsInputSchema)) input: ReportsInput,
  ): Promise<GraphqlQuery['reports']> {
    const page = await this.reports.list(tenant.tenantId, input)
    return { items: page.items.map((report) => this.serialize(report)), totalCount: page.totalCount }
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
    return { created: result.created, report: this.serialize(result.report) }
  }

  @Mutation('submitReport')
  @UseGuards(...roleGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async submit(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(reportRevisionInputSchema)) input: ReportRevisionInput,
  ): Promise<GraphqlMutation['submitReport']> {
    return this.serialize(await this.reports.submit(tenant.tenantId, this.toActor(actor), input))
  }

  @Mutation('deleteReport')
  @UseGuards(...roleGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  delete(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(reportRevisionInputSchema)) input: ReportRevisionInput,
  ): Promise<boolean> {
    return this.reports.delete(tenant.tenantId, input)
  }

  private toTenant(tenant: AuthorizedTenant) {
    return {
      tenantId: tenant.tenantId,
      timezone: tenant.tenant.timezone,
      shifts: tenant.tenant.shifts ?? [],
    }
  }

  private toActor(actor: AuthenticatedActor) {
    return { userId: actor.userId, name: actor.user.fullName || actor.user.username }
  }

  private serialize(report: ReportRecord) {
    return {
      id: report._id,
      businessDate: report.businessDate,
      shiftId: report.shiftId,
      interval: report.interval,
      creatorId: report.creatorId,
      creatorName: report.creatorName,
      status: report.status,
      revision: report.revision,
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
      submittedAt: report.submittedAt?.toISOString(),
      submittedById: report.submittedById,
      submittedByName: report.submittedByName,
    }
  }
}
