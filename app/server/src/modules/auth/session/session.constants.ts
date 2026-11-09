export const ACCESS_TOKEN_TTL_SECONDS = 5 * 60
export const REFRESH_TOKEN_TTL_MILLISECONDS = 15 * 24 * 60 * 60 * 1000
export const SESSION_MAXIMUM_TTL_MILLISECONDS = 60 * 24 * 60 * 60 * 1000

export const ACCESS_TOKEN_ISSUER = 'petromate'
export const ACCESS_TOKEN_AUDIENCE = 'petromate-api'
export const REFRESH_TOKEN_AUDIENCE = 'petromate-session'
export const REFRESH_TOKEN_COOKIE = 'petromate_refresh'
export const REFRESH_TOKEN_COOKIE_PATH = '/api/auth/session'
