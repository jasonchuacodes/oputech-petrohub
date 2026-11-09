import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { Types } from 'mongoose'
import { forbidden, invalidInput, unauthenticated } from '../../../common/exceptions/errors'
import { MembershipsService } from '../../memberships/memberships.service'

@Injectable()
export class TenantAccessGuard implements CanActivate {
  constructor(private readonly memberships: MembershipsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context)
    if (!request.actor) throw unauthenticated()

    const tenantHeader = request.header('x-tenant-id')
    if (!tenantHeader || !Types.ObjectId.isValid(tenantHeader)) {
      throw invalidInput('A valid tenant is required.')
    }

    const tenantId = new Types.ObjectId(tenantHeader)
    const membership = await this.memberships.findActive(tenantId, request.actor.userId)
    if (!membership) throw forbidden('You do not have access to this tenant.')

    request.authorizedTenant = {
      tenantId,
      membershipId: membership._id,
      role: membership.role,
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
