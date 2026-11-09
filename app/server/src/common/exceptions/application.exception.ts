import { HttpException, HttpStatus } from '@nestjs/common'

export type ApplicationErrorCode =
  | 'AUTHENTICATION_REQUIRED'
  | 'INVALID_CREDENTIALS'
  | 'SESSION_EXPIRED'
  | 'CSRF_INVALID'
  | 'FORBIDDEN'
  | 'INVALID_INPUT'
  | 'NOT_FOUND'
  | 'CONFLICT'

export class ApplicationException extends HttpException {
  constructor(
    readonly code: ApplicationErrorCode,
    message: string,
    status: HttpStatus,
    readonly details?: unknown,
  ) {
    super({ code, message, details }, status)
  }
}
