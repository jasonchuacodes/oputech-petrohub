import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common'

export type ApplicationErrorCode =
  | 'AUTHENTICATION_REQUIRED'
  | 'INVALID_SESSION'
  | 'INVALID_CREDENTIALS'
  | 'FORBIDDEN'
  | 'INVALID_INPUT'
  | 'NOT_FOUND'
  | 'CONFLICT'

export interface ApplicationExceptionOptions extends HttpExceptionOptions {
  details?: unknown
}

export class ApplicationException extends HttpException {
  constructor(
    readonly code: ApplicationErrorCode,
    message: string,
    status: HttpStatus,
    options: ApplicationExceptionOptions = {},
  ) {
    const { details, ...httpOptions } = options
    super({ code, message, ...(details === undefined ? {} : { details }) }, status, httpOptions)
  }
}
