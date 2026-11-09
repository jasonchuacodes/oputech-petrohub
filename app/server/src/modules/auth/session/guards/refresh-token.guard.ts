import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { invalidSession } from '../../../../common/exceptions/errors'
import { getRefreshToken } from '../session-cookie'
import { AuthenticatedRequest } from '../session-request'
import { SessionTokenService } from '../session-token.service'

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly tokens: SessionTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const refreshToken = getRefreshToken(request)
    if (!refreshToken) throw invalidSession()

    request.refreshTokenClaims = await this.tokens.verifyRefreshToken(refreshToken)
    return true
  }
}
