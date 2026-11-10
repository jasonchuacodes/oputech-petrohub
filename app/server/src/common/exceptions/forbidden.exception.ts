import { HttpStatus } from '@nestjs/common'
import { ApplicationException, ApplicationExceptionOptions } from './application.exception'

export class ForbiddenException extends ApplicationException {
  constructor(
    message = 'You do not have permission to perform this action.',
    options: ApplicationExceptionOptions = {},
  ) {
    super('FORBIDDEN', message, HttpStatus.FORBIDDEN, options)
  }
}
