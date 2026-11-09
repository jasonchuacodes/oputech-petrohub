import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(error: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') throw error

    const context = host.switchToHttp()
    const request = context.getRequest<Request>()
    const response = context.getResponse<Response>()
    const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const exceptionResponse = error instanceof HttpException ? error.getResponse() : null
    const payload =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? exceptionResponse
        : { message: String(exceptionResponse ?? 'Unexpected error') }

    if (!(error instanceof HttpException)) {
      this.logger.error({ error, path: request.path }, 'Unhandled request error')
    }

    response.status(status).json({
      type: 'about:blank',
      title: status === 500 ? 'Internal Server Error' : 'Request failed',
      status,
      path: request.path,
      ...(status === 500 ? { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' } : payload),
    })
  }
}
