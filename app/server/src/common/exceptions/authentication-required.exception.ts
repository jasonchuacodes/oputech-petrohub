import { HttpStatus } from '@nestjs/common'
import { ApplicationException, ApplicationExceptionOptions } from './application.exception'

export class AuthenticationRequiredException extends ApplicationException {
  constructor(
    message = 'Please sign in to continue.',
    options: ApplicationExceptionOptions = {},
  ) {
    super('AUTHENTICATION_REQUIRED', message, HttpStatus.UNAUTHORIZED, options)
  }
}
