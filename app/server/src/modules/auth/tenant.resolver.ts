import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { Mutation as GraphqlMutation, Query as GraphqlQuery } from '../../generated/graphql'
import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe'
import {
  createShiftInputSchema,
  CreateShiftInput,
  createTenantInputSchema,
  CreateTenantInput,
  deleteShiftInputSchema,
  DeleteShiftInput,
  deleteTenantInputSchema,
  DeleteTenantInput,
  updateShiftInputSchema,
  UpdateShiftInput,
  updateTenantInputSchema,
  UpdateTenantInput,
  updateRecurringIncomeConfigurationInputSchema,
  UpdateRecurringIncomeConfigurationInput,
} from '../tenants/tenant.schemas'
import { TenantService } from '../tenants/tenant.service'
import { AuthenticatedActor, AuthorizedTenant } from './auth.types'
import { CurrentActor } from './decorators/current-actor.decorator'
import { CurrentTenant } from './decorators/current-tenant.decorator'
import { TenantAccessGuard } from './guards/tenant-access.guard'
import { SuperadminGuard } from './guards/superadmin.guard'
import { AccessTokenGuard } from './session/guards/access-token.guard'
import { RequireRoles, RolesGuard } from './guards/roles.guard'
import { UserRole } from '../users/schemas/user.schema'

@Resolver()
@UseGuards(AccessTokenGuard)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query('tenants')
  async tenants(@CurrentActor() actor: AuthenticatedActor): Promise<GraphqlQuery['tenants']> {
    const tenants = await this.tenantService.listForUser(actor)
    return tenants.map((tenant) => ({
      role: actor.user.role,
      tenant: {
        id: tenant._id,
        name: tenant.name,
        timezone: tenant.timezone,
        currency: tenant.currency,
      },
    }))
  }

  @Mutation('createTenant')
  @UseGuards(SuperadminGuard)
  async createTenant(
    @CurrentActor() actor: AuthenticatedActor,
    @Args('input', new ZodValidationPipe(createTenantInputSchema)) input: CreateTenantInput,
  ): Promise<GraphqlMutation['createTenant']> {
    const tenant = await this.tenantService.create(actor.userId, input)
    return {
      id: tenant._id,
      name: tenant.name,
      timezone: tenant.timezone,
      currency: tenant.currency,
    }
  }

  @Mutation('updateTenant')
  async updateTenant(
    @CurrentActor() actor: AuthenticatedActor,
    @Args('input', new ZodValidationPipe(updateTenantInputSchema)) input: UpdateTenantInput,
  ): Promise<GraphqlMutation['updateTenant']> {
    const tenant = await this.tenantService.update(actor, input)
    return {
      id: tenant._id,
      name: tenant.name,
      timezone: tenant.timezone,
      currency: tenant.currency,
    }
  }

  @Mutation('deleteTenant')
  @UseGuards(SuperadminGuard)
  async deleteTenant(
    @CurrentActor() actor: AuthenticatedActor,
    @Args('input', new ZodValidationPipe(deleteTenantInputSchema)) input: DeleteTenantInput,
  ): Promise<GraphqlMutation['deleteTenant']> {
    return this.tenantService.delete(actor, input)
  }

  @Query('activeTenant')
  @UseGuards(TenantAccessGuard)
  async activeTenant(
    @CurrentTenant() context: AuthorizedTenant,
  ): Promise<GraphqlQuery['activeTenant']> {
    return {
      id: context.tenant._id,
      name: context.tenant.name,
      timezone: context.tenant.timezone,
      currency: context.tenant.currency,
    }
  }

  @Query('shifts')
  @UseGuards(TenantAccessGuard, RolesGuard)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async shifts(
    @CurrentTenant() context: AuthorizedTenant,
  ): Promise<GraphqlQuery['shifts']> {
    return this.tenantService.listShifts(context.tenantId)
  }

  @Mutation('createShift')
  @UseGuards(TenantAccessGuard, RolesGuard)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async createShift(
    @CurrentTenant() context: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(createShiftInputSchema)) input: CreateShiftInput,
  ): Promise<GraphqlMutation['createShift']> {
    return this.tenantService.createShift(context.tenantId, input)
  }

  @Mutation('updateShift')
  @UseGuards(TenantAccessGuard, RolesGuard)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async updateShift(
    @CurrentTenant() context: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(updateShiftInputSchema)) input: UpdateShiftInput,
  ): Promise<GraphqlMutation['updateShift']> {
    return this.tenantService.updateShift(context.tenantId, input)
  }

  @Mutation('deleteShift')
  @UseGuards(TenantAccessGuard, RolesGuard)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async deleteShift(
    @CurrentTenant() context: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(deleteShiftInputSchema)) input: DeleteShiftInput,
  ): Promise<GraphqlMutation['deleteShift']> {
    return this.tenantService.deleteShift(context.tenantId, input)
  }

  @Query('recurringIncomeConfiguration')
  @UseGuards(TenantAccessGuard, RolesGuard)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async recurringIncomeConfiguration(
    @CurrentTenant() context: AuthorizedTenant,
  ): Promise<GraphqlQuery['recurringIncomeConfiguration']> {
    return this.tenantService.getRecurringIncomeConfiguration(context.tenantId)
  }

  @Mutation('updateRecurringIncomeConfiguration')
  @UseGuards(TenantAccessGuard, RolesGuard)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async updateRecurringIncomeConfiguration(
    @CurrentTenant() context: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(updateRecurringIncomeConfigurationInputSchema))
    input: UpdateRecurringIncomeConfigurationInput,
  ): Promise<GraphqlMutation['updateRecurringIncomeConfiguration']> {
    return this.tenantService.updateRecurringIncomeConfiguration(context.tenantId, input)
  }
}
