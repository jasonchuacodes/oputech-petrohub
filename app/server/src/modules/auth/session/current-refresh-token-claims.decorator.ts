import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthenticatedRequest } from './session-request'
import { RefreshTokenClaims } from './session.types'

export const CurrentRefreshTokenClaims = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RefreshTokenClaims => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    return request.refreshTokenClaims as RefreshTokenClaims
  },
)
