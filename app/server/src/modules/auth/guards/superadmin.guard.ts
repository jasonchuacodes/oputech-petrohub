import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthenticationRequiredException, ForbiddenException } from '../../../common/exceptions'
import { UserRole } from '../../users/schemas/user.schema'
import { getSessionRequest } from '../session/session-request'

@Injectable()
export class SuperadminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const actor = getSessionRequest(context).actor
    if (!actor) throw new AuthenticationRequiredException()
    if (actor.user.role !== UserRole.SUPERADMIN) throw new ForbiddenException()
    return true
  }
}
