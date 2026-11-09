import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { tokenMatches } from '../../../common/crypto/tokens'
import { invalidCsrf, unauthenticated } from '../../../common/exceptions/errors'

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest(context)
    if (!request.actor) throw unauthenticated()

    const token = request.header('x-csrf-token')
    if (!token || !tokenMatches(token, request.actor.csrfTokenHash)) throw invalidCsrf()
    return true
  }

  private getRequest(context: ExecutionContext): Request {
    if (context.getType<'http' | 'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext<{ req: Request }>().req
    }
    return context.switchToHttp().getRequest<Request>()
  }
}
