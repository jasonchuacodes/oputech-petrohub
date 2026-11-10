import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { forbidden, unauthenticated } from '../../../common/exceptions/errors'
import { UserRole } from '../../users/schemas/user.schema'
import { getSessionRequest } from '../session/session-request'

@Injectable()
export class SuperadminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const actor = getSessionRequest(context).actor
    if (!actor) throw unauthenticated()
    if (actor.user.role !== UserRole.SUPERADMIN) throw forbidden()
    return true
  }
}
