import { HttpStatus } from '@nestjs/common'
import { ApplicationException, ApplicationExceptionOptions } from './application.exception'

export class InvalidInputException extends ApplicationException {
  constructor(message: string, options: ApplicationExceptionOptions = {}) {
    super('INVALID_INPUT', message, HttpStatus.BAD_REQUEST, options)
  }
}
