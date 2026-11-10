import { HttpStatus } from '@nestjs/common'
import { ApplicationException, ApplicationExceptionOptions } from './application.exception'

export class InvalidCredentialsException extends ApplicationException {
  constructor(
    message = 'The username or password is incorrect.',
    options: ApplicationExceptionOptions = {},
  ) {
    super('INVALID_CREDENTIALS', message, HttpStatus.UNAUTHORIZED, options)
  }
}
