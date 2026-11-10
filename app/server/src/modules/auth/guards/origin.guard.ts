import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { ForbiddenException } from '../../../common/exceptions'
import { Environment } from '../../../config/environment'

@Injectable()
export class OriginGuard implements CanActivate {
  constructor(private readonly config: ConfigService<Environment, true>) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const origin = request.header('origin')
    if (origin !== this.config.get('CLIENT_ORIGIN', { infer: true })) {
      throw new ForbiddenException('The request origin is not allowed.')
    }
    return true
  }
}
