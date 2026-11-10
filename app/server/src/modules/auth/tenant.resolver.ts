import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { Mutation as GraphqlMutation, Query as GraphqlQuery } from '../../generated/graphql'
import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe'
import {
  createTenantInputSchema,
  CreateTenantInput,
  deleteTenantInputSchema,
  DeleteTenantInput,
  updateTenantInputSchema,
  UpdateTenantInput,
} from '../tenants/tenant.schemas'
import { TenantService } from '../tenants/tenant.service'
import { AuthenticatedActor, AuthorizedTenant } from './auth.types'
import { CurrentActor } from './decorators/current-actor.decorator'
import { CurrentTenant } from './decorators/current-tenant.decorator'
import { TenantAccessGuard } from './guards/tenant-access.guard'
import { SuperadminGuard } from './guards/superadmin.guard'
import { AccessTokenGuard } from './session/guards/access-token.guard'

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
}
