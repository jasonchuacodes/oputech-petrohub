import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { Query as GraphqlQuery } from '../../generated/graphql'
import { CurrentActor } from './decorators/current-actor.decorator'
import { CurrentTenant } from './decorators/current-tenant.decorator'
import { AuthenticatedActor, AuthorizedTenant } from './auth.types'
import { AccessTokenGuard } from './session/guards/access-token.guard'
import { TenantAccessGuard } from './guards/tenant-access.guard'
import { TenantService } from '../tenants/tenant.service'

@Resolver()
@UseGuards(AccessTokenGuard)
export class ViewerResolver {
  constructor(
    private readonly tenantService: TenantService,
  ) {}

  @Query('viewer')
  viewer(@CurrentActor() actor: AuthenticatedActor): GraphqlQuery['viewer'] {
    return actor.user
  }

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
