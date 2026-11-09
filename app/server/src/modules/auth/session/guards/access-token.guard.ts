import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { invalidSession } from '../../../../common/exceptions/errors'
import { getSessionRequest } from '../session-request'
import { SessionService } from '../session.service'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly sessions: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getSessionRequest(context)
    const match = /^Bearer\s+(\S+)$/i.exec(request.headers.authorization ?? '')
    const accessToken = match?.[1]
    if (!accessToken) throw invalidSession()

    request.actor = await this.sessions.verifySession(accessToken)
    return true
  }
}
