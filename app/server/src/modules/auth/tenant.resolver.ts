import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import type { Query as GraphqlQuery } from '../../generated/graphql'
import { TenantService } from '../tenants/tenant.service'
import { AuthenticatedActor, AuthorizedTenant } from './auth.types'
import { CurrentActor } from './decorators/current-actor.decorator'
import { CurrentTenant } from './decorators/current-tenant.decorator'
import { TenantAccessGuard } from './guards/tenant-access.guard'
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
