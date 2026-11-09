import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { forbidden, unauthenticated } from '../../../common/exceptions/errors'
import { MembershipRole } from '../../memberships/schemas/membership.schema'

const ROLES_KEY = 'membership-roles'
export const RequireRoles = (...roles: MembershipRole[]) => SetMetadata(ROLES_KEY, roles)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<MembershipRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!roles?.length) return true

    const request = this.getRequest(context)
    if (!request.authorizedTenant) throw unauthenticated()
    if (!roles.includes(request.authorizedTenant.role)) throw forbidden()
    return true
  }

  private getRequest(context: ExecutionContext): Request {
    if (context.getType<'http' | 'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext<{ req: Request }>().req
    }
    return context.switchToHttp().getRequest<Request>()
  }
}
