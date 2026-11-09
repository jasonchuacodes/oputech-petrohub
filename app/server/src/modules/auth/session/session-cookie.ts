import { CookieOptions, Request } from 'express'
import { Environment } from '../../../config/environment'
import { REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE_PATH } from './session.constants'

export function getRefreshToken(request: Request): string | undefined {
  const cookies = request.cookies as Record<string, unknown> | undefined
  const refreshToken = cookies?.[REFRESH_TOKEN_COOKIE]
  return typeof refreshToken === 'string' ? refreshToken : undefined
}

export function createRefreshCookieOptions(
  nodeEnvironment: Environment['NODE_ENV'],
  dateTimeExpiration: Date,
): CookieOptions {
  return {
    expires: dateTimeExpiration,
    httpOnly: true,
    maxAge: Math.max(0, dateTimeExpiration.getTime() - Date.now()),
    path: REFRESH_TOKEN_COOKIE_PATH,
    sameSite: 'lax',
    secure: nodeEnvironment === 'production',
  }
}

export function createClearCookieOptions(
  nodeEnvironment: Environment['NODE_ENV'],
): CookieOptions {
  return {
    httpOnly: true,
    path: REFRESH_TOKEN_COOKIE_PATH,
    sameSite: 'lax',
    secure: nodeEnvironment === 'production',
  }
}
