import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CurrentActor } from './decorators/current-actor.decorator'
import { CurrentTenant } from './decorators/current-tenant.decorator'
import { AuthenticatedActor, AuthorizedTenant } from './auth.types'
import { SessionGuard } from './guards/session.guard'
import { TenantAccessGuard } from './guards/tenant-access.guard'
import { MembershipsService } from '../memberships/memberships.service'
import { TenantsService } from '../tenants/tenants.service'

@Resolver()
@UseGuards(SessionGuard)
export class ViewerResolver {
  constructor(
    private readonly memberships: MembershipsService,
    private readonly tenants: TenantsService,
  ) {}

  @Query('viewer')
  viewer(@CurrentActor() actor: AuthenticatedActor) {
    return actor.user
  }

  @Query('myTenants')
  async myTenants(@CurrentActor() actor: AuthenticatedActor) {
    const memberships = await this.memberships.findActiveForUser(actor.userId)
    return Promise.all(
      memberships.map(async (membership) => {
        const tenant = await this.tenants.findActiveById(membership.tenantId)
        return tenant
          ? {
              membershipId: membership.id,
              role: membership.role,
              tenant: {
                id: tenant.id,
                name: tenant.name,
                timezone: tenant.timezone,
                currency: tenant.currency,
              },
            }
          : null
      }),
    ).then((entries) => entries.filter((entry) => entry !== null))
  }

  @Query('activeTenant')
  @UseGuards(TenantAccessGuard)
  async activeTenant(@CurrentTenant() context: AuthorizedTenant) {
    const tenant = await this.tenants.findActiveById(context.tenantId)
    return tenant
      ? {
          id: tenant.id,
          name: tenant.name,
          timezone: tenant.timezone,
          currency: tenant.currency,
        }
      : null
  }
}
