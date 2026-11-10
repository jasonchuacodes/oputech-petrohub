import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { AuthenticationRequiredException, ForbiddenException } from '../../../common/exceptions'
import { UserRole } from '../../users/schemas/user.schema'

const ROLES_KEY = 'user-roles'
export const RequireRoles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!roles?.length) return true

    const request = this.getRequest(context)
    if (!request.authorizedTenant) throw new AuthenticationRequiredException()
    if (!roles.includes(request.authorizedTenant.role)) throw new ForbiddenException()
    return true
  }

  private getRequest(context: ExecutionContext): Request {
    if (context.getType<'http' | 'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext<{ req: Request }>().req
    }
    return context.switchToHttp().getRequest<Request>()
  }
}
