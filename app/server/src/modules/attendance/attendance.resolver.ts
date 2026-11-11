import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { Mutation as GraphqlMutation, Query as GraphqlQuery } from '../../generated/graphql'
import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe'
import { ForbiddenException } from '../../common/exceptions'
import { AuthenticatedActor, AuthorizedTenant } from '../auth/auth.types'
import { CurrentActor } from '../auth/decorators/current-actor.decorator'
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator'
import { RequireRoles, RolesGuard } from '../auth/guards/roles.guard'
import { TenantAccessGuard } from '../auth/guards/tenant-access.guard'
import { AccessTokenGuard } from '../auth/session/guards/access-token.guard'
import { UserRole } from '../users/schemas/user.schema'
import {
  checkInAttendanceInputSchema,
  CheckInAttendanceInput,
  checkOutAttendanceInputSchema,
  CheckOutAttendanceInput,
  setTimesheetDayOverrideInputSchema,
  SetTimesheetDayOverrideInput,
  timesheetDaysFilterSchema,
  TimesheetDaysFilter,
  timesheetsFilterSchema,
  TimesheetsFilter,
} from './attendance.schemas'
import { AttendanceService, serializeCalculatedDay } from './attendance.service'

const roleGuards = [AccessTokenGuard, TenantAccessGuard, RolesGuard]

@Resolver()
export class AttendanceResolver {
  constructor(private readonly attendance: AttendanceService) {}

  @Query('myAttendance')
  @UseGuards(...roleGuards)
  @RequireRoles(UserRole.MEMBER)
  async status(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
  ): Promise<GraphqlQuery['myAttendance']> {
    return this.serializeStatus(await this.attendance.status(this.scope(actor, tenant)))
  }

  @Mutation('checkInAttendance')
  @UseGuards(...roleGuards)
  @RequireRoles(UserRole.MEMBER)
  async checkIn(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(checkInAttendanceInputSchema)) input: CheckInAttendanceInput,
  ): Promise<GraphqlMutation['checkInAttendance']> {
    return this.serializeStatus(await this.attendance.checkIn(this.scope(actor, tenant), input))
  }

  @Mutation('checkOutAttendance')
  @UseGuards(...roleGuards)
  @RequireRoles(UserRole.MEMBER)
  async checkOut(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(checkOutAttendanceInputSchema)) input: CheckOutAttendanceInput,
  ): Promise<GraphqlMutation['checkOutAttendance']> {
    return this.serializeStatus(await this.attendance.checkOut(this.scope(actor, tenant), input))
  }

  @Query('timesheets')
  @UseGuards(...roleGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MEMBER)
  async timesheets(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('filter', new ZodValidationPipe(timesheetsFilterSchema)) filter: TimesheetsFilter,
  ): Promise<GraphqlQuery['timesheets']> {
    const scopedInput = tenant.role === UserRole.MEMBER
      ? { ...filter, userId: actor.userId }
      : filter
    if (
      tenant.role === UserRole.MEMBER &&
      filter.userId &&
      !filter.userId.equals(actor.userId)
    ) {
      throw new ForbiddenException('You can only view your own timesheet.')
    }
    const page = await this.attendance.list(tenant.tenantId, tenant.tenant.timezone, scopedInput)
    return { ...page, asOf: page.asOf.toISOString() }
  }

  @Query('timesheetDays')
  @UseGuards(...roleGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MEMBER)
  async days(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('filter', new ZodValidationPipe(timesheetDaysFilterSchema)) filter: TimesheetDaysFilter,
  ): Promise<GraphqlQuery['timesheetDays']> {
    if (tenant.role === UserRole.MEMBER && !filter.userId.equals(actor.userId)) {
      throw new ForbiddenException('You can only view your own timesheet.')
    }
    const result = await this.attendance.days(tenant.tenantId, tenant.tenant.timezone, filter)
    return { ...result, days: result.days.map(serializeCalculatedDay) }
  }

  @Mutation('setTimesheetDayOverride')
  @UseGuards(...roleGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async setOverride(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(setTimesheetDayOverrideInputSchema))
    input: SetTimesheetDayOverrideInput,
  ): Promise<GraphqlMutation['setTimesheetDayOverride']> {
    return serializeCalculatedDay(
      (await this.attendance.setOverride(
        tenant.tenantId,
        tenant.tenant.timezone,
        actor.userId,
        input,
      ))!,
    )
  }

  private scope(actor: AuthenticatedActor, tenant: AuthorizedTenant) {
    return {
      tenantId: tenant.tenantId,
      userId: actor.userId,
      timezone: tenant.tenant.timezone,
    }
  }

  private serializeStatus(status: Awaited<ReturnType<AttendanceService['status']>>) {
    return {
      localDate: status.localDate,
      timezone: status.timezone,
      asOf: status.asOf.toISOString(),
      trackedSeconds: status.trackedSeconds,
      automaticSeconds: status.automaticSeconds,
      activeSession: status.activeSession
        ? { id: status.activeSession._id, startedAt: status.activeSession.startedAt.toISOString() }
        : null,
    }
  }
}
