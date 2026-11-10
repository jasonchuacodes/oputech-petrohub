import { HttpStatus } from '@nestjs/common'
import { ApplicationException, ApplicationExceptionOptions } from './application.exception'

export class ConflictException extends ApplicationException {
  constructor(message: string, options: ApplicationExceptionOptions = {}) {
    super('CONFLICT', message, HttpStatus.CONFLICT, options)
  }
}
