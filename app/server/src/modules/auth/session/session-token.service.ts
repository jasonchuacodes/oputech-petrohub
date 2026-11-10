import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { z } from 'zod'
import { InvalidSessionException } from '../../../common/exceptions'
import { Environment } from '../../../config/environment'
import { TokenType } from '../token-type.enum'
import {
  ACCESS_TOKEN_AUDIENCE,
  ACCESS_TOKEN_ISSUER,
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_AUDIENCE,
} from './session.constants'
import { AccessTokenClaims, RefreshTokenClaims } from './session.types'

const accessTokenClaimsSchema = z.object({
  sub: z.string().min(1),
  sid: z.uuid(),
  tokenType: z.literal(TokenType.ACCESS),
  iat: z.number().int().nonnegative(),
  exp: z.number().int().positive(),
})

const refreshTokenClaimsSchema = z.object({
  sub: z.string().min(1),
  sid: z.uuid(),
  jti: z.uuid(),
  tokenType: z.literal(TokenType.REFRESH),
  iat: z.number().int().nonnegative(),
  exp: z.number().int().positive(),
})

@Injectable()
export class SessionTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<Environment, true>,
  ) {}

  async issueAccessToken(userId: string, sessionKey: string) {
    try {
      const accessToken = await this.jwtService.signAsync(
        { sub: userId, sid: sessionKey, tokenType: TokenType.ACCESS },
        { expiresIn: ACCESS_TOKEN_TTL_SECONDS },
      )
      const claims = accessTokenClaimsSchema.parse(this.jwtService.decode(accessToken))
      return { accessToken, dateTimeExpiration: new Date(claims.exp * 1000) }
    } catch {
      throw new ServiceUnavailableException('Authentication service is unavailable')
    }
  }

  async verifyAccessToken(accessToken: string): Promise<AccessTokenClaims> {
    try {
      const claims = await this.jwtService.verifyAsync<Record<string, unknown>>(accessToken, {
        algorithms: ['HS256'],
        audience: ACCESS_TOKEN_AUDIENCE,
        issuer: ACCESS_TOKEN_ISSUER,
      })
      return accessTokenClaimsSchema.parse(claims)
    } catch {
      throw new InvalidSessionException()
    }
  }

  async issueRefreshToken(
    userId: string,
    sessionKey: string,
    jti: string,
    dateTimeExpiration: Date,
  ) {
    try {
      const refreshToken = await this.jwtService.signAsync(
        {
          exp: Math.floor(dateTimeExpiration.getTime() / 1000),
          jti,
          sid: sessionKey,
          sub: userId,
          tokenType: TokenType.REFRESH,
        },
        {
          algorithm: 'HS256',
          audience: REFRESH_TOKEN_AUDIENCE,
          issuer: ACCESS_TOKEN_ISSUER,
          secret: this.config.get('AUTH_REFRESH_TOKEN_SECRET', { infer: true }),
        },
      )
      const claims = refreshTokenClaimsSchema.parse(this.jwtService.decode(refreshToken))
      return { refreshToken, dateTimeExpiration: new Date(claims.exp * 1000) }
    } catch {
      throw new ServiceUnavailableException('Authentication service is unavailable')
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<RefreshTokenClaims> {
    try {
      const claims = await this.jwtService.verifyAsync<Record<string, unknown>>(refreshToken, {
        algorithms: ['HS256'],
        audience: REFRESH_TOKEN_AUDIENCE,
        issuer: ACCESS_TOKEN_ISSUER,
        secret: this.config.get('AUTH_REFRESH_TOKEN_SECRET', { infer: true }),
      })
      return refreshTokenClaimsSchema.parse(claims)
    } catch {
      throw new InvalidSessionException()
    }
  }
}
