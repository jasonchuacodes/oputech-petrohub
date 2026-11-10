import { HttpStatus } from '@nestjs/common'
import { ApplicationException, ApplicationExceptionOptions } from './application.exception'

export class NotFoundException extends ApplicationException {
  constructor(message: string, options: ApplicationExceptionOptions = {}) {
    super('NOT_FOUND', message, HttpStatus.NOT_FOUND, options)
  }
}
