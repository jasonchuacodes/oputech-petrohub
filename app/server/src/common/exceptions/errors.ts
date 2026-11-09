import { HttpStatus } from '@nestjs/common'
import { ApplicationException } from './application.exception'

export const invalidInput = (message: string, details?: unknown) =>
  new ApplicationException('INVALID_INPUT', message, HttpStatus.BAD_REQUEST, details)

export const unauthenticated = (message = 'Please sign in to continue.') =>
  new ApplicationException('AUTHENTICATION_REQUIRED', message, HttpStatus.UNAUTHORIZED)

export const invalidCredentials = () =>
  new ApplicationException(
    'INVALID_CREDENTIALS',
    'The username or password is incorrect.',
    HttpStatus.UNAUTHORIZED,
  )

export const invalidCsrf = () =>
  new ApplicationException(
    'CSRF_INVALID',
    'The request could not be verified. Refresh and try again.',
    HttpStatus.FORBIDDEN,
  )

export const forbidden = (message = 'You do not have permission to perform this action.') =>
  new ApplicationException('FORBIDDEN', message, HttpStatus.FORBIDDEN)

export const notFound = (message: string) =>
  new ApplicationException('NOT_FOUND', message, HttpStatus.NOT_FOUND)

export const conflict = (message: string) =>
  new ApplicationException('CONFLICT', message, HttpStatus.CONFLICT)
