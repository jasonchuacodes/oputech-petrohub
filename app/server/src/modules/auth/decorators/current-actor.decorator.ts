import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { unauthenticated } from '../../../common/exceptions/errors'

export const CurrentActor = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const request =
    context.getType<'http' | 'graphql'>() === 'graphql'
      ? GqlExecutionContext.create(context).getContext<{ req: Request }>().req
      : context.switchToHttp().getRequest<Request>()
  if (!request.actor) throw unauthenticated()
  return request.actor
})
