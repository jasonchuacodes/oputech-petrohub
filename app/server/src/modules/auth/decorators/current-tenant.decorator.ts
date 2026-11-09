import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { unauthenticated } from '../../../common/exceptions/errors'

export const CurrentTenant = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const request =
    context.getType<'http' | 'graphql'>() === 'graphql'
      ? GqlExecutionContext.create(context).getContext<{ req: Request }>().req
      : context.switchToHttp().getRequest<Request>()
  if (!request.authorizedTenant) throw unauthenticated()
  return request.authorizedTenant
})
