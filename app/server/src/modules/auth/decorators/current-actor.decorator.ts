import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { AuthenticationRequiredException } from '../../../common/exceptions'

export const CurrentActor = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const request =
    context.getType<'http' | 'graphql'>() === 'graphql'
      ? GqlExecutionContext.create(context).getContext<{ req: Request }>().req
      : context.switchToHttp().getRequest<Request>()
  if (!request.actor) throw new AuthenticationRequiredException()
  return request.actor
})
