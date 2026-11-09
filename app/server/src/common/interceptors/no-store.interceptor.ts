import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Response } from 'express'
import { Observable } from 'rxjs'

@Injectable()
export class NoStoreInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() === 'http') {
      context.switchToHttp().getResponse().setHeader('Cache-Control', 'no-store')
    } else if (context.getType<'http' | 'graphql'>() === 'graphql') {
      GqlExecutionContext.create(context)
        .getContext<{ res: Response }>()
        .res.setHeader('Cache-Control', 'no-store')
    }
    return next.handle()
  }
}
