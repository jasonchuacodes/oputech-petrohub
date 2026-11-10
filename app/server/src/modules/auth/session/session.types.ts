import { AuthenticatedUser } from '../../users/users.service'
import { UserRole } from '../../users/schemas/user.schema'
import { TokenType } from '../token-type.enum'

export type SessionResponse = {
  accessToken: string
  tokenType: TokenType.ACCESS
  dateTimeExpiration: string
  user: AuthenticatedUser
  tenantAccess: Array<{ tenantId: string; role: UserRole }>
}

export type IssuedSession = {
  response: SessionResponse
  refreshToken: string
  dateTimeExpiration: Date
}

export type AccessTokenClaims = {
  sub: string
  sid: string
  tokenType: TokenType.ACCESS
  iat: number
  exp: number
}

export type RefreshTokenClaims = {
  sub: string
  sid: string
  jti: string
  tokenType: TokenType.REFRESH
  iat: number
  exp: number
}
