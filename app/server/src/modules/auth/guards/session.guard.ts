import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { unauthenticated } from '../../../common/exceptions/errors'
import { Environment } from '../../../config/environment'
import { SessionService } from '../session.service'

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly sessions: SessionService,
    private readonly config: ConfigService<Environment, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context)
    const cookieName = this.config.get('SESSION_COOKIE_NAME', { infer: true })
    const actor = await this.sessions.authenticate(request.cookies?.[cookieName])
    if (!actor) throw unauthenticated()

    request.actor = actor
    return true
  }

  private getRequest(context: ExecutionContext): Request {
    if (context.getType<'http' | 'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext<{ req: Request }>().req
    }
    return context.switchToHttp().getRequest<Request>()
  }
}
