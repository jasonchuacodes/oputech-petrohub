import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { unauthenticated } from '../../../common/exceptions/errors'
import { TenantService } from '../../tenants/tenant.service'

@Injectable()
export class TenantAccessGuard implements CanActivate {
  constructor(
    private readonly tenants: TenantService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context)
    if (!request.actor) throw unauthenticated()

    const tenantHeader = request.header('x-tenant-id')
    const tenant = await this.tenants.assertAccess(request.actor, tenantHeader ?? '')

    request.authorizedTenant = {
      tenantId: tenant._id,
      role: request.actor.user.role,
      tenant,
    }
    return true
  }

  private getRequest(context: ExecutionContext): Request {
    if (context.getType<'http' | 'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext<{ req: Request }>().req
    }
    return context.switchToHttp().getRequest<Request>()
  }
}
