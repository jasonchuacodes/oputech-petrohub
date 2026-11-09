import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { AuthenticatedActor } from '../auth.types'
import { RefreshTokenClaims } from './session.types'

export interface AuthenticatedRequest extends Request {
  actor?: AuthenticatedActor
  refreshTokenClaims?: RefreshTokenClaims
}

export function getSessionRequest(context: ExecutionContext): AuthenticatedRequest {
  if (context.getType<string>() === 'graphql') {
    return GqlExecutionContext.create(context).getContext<{ req: AuthenticatedRequest }>().req
  }
  return context.switchToHttp().getRequest<AuthenticatedRequest>()
}
