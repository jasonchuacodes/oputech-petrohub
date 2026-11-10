import { HttpStatus } from '@nestjs/common'
import { ApplicationException, ApplicationExceptionOptions } from './application.exception'

export class InvalidSessionException extends ApplicationException {
  constructor(
    message = 'Invalid or expired session.',
    options: ApplicationExceptionOptions = {},
  ) {
    super('INVALID_SESSION', message, HttpStatus.UNAUTHORIZED, options)
  }
}
