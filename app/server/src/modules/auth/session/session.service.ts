import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { verify } from 'argon2'
import { randomUUID } from 'node:crypto'
import { Model, Types } from 'mongoose'
import { invalidCredentials, invalidSession } from '../../../common/exceptions/errors'
import { TenantService } from '../../tenants/tenant.service'
import { UsersService } from '../../users/users.service'
import { LoginInput } from '../auth.schemas'
import { AuthenticatedActor } from '../auth.types'
import { Session, SessionDocument } from '../schemas/session.schema'
import { TokenType } from '../token-type.enum'
import {
  REFRESH_TOKEN_TTL_MILLISECONDS,
  SESSION_MAXIMUM_TTL_MILLISECONDS,
} from './session.constants'
import { SessionTokenService } from './session-token.service'
import { IssuedSession, RefreshTokenClaims } from './session.types'

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    private readonly users: UsersService,
    private readonly tenants: TenantService,
    private readonly tokenService: SessionTokenService,
  ) {}

  async postSession(input: LoginInput): Promise<IssuedSession> {
    const user = await this.users.findByUsername(input.username)
    if (!user || !(await verify(user.passwordHash, input.password))) throw invalidCredentials()

    const sessionKey = randomUUID()
    const jti = randomUUID()
    const requestedDateTimeExpiration = new Date(Date.now() + REFRESH_TOKEN_TTL_MILLISECONDS)
    const userId = user._id.toHexString()
    const refreshCredential = await this.tokenService.issueRefreshToken(
      userId,
      sessionKey,
      jti,
      requestedDateTimeExpiration,
    )
    const accessCredential = await this.tokenService.issueAccessToken(userId, sessionKey)
    const replacement = {
      userId: user._id,
      credentialVersion: user.credentialVersion,
      dateTimeExpiration: refreshCredential.dateTimeExpiration,
      dateTimeRevoked: null,
      jti,
      sessionKey,
      tokenType: TokenType.REFRESH,
    } as const

    try {
      await this.replaceSession(replacement, true)
    } catch (error) {
      if (!isDuplicateKeyError(error)) {
        throw new ServiceUnavailableException('Authentication service is unavailable')
      }
      try {
        await this.replaceSession(replacement, false)
      } catch {
        throw new ServiceUnavailableException('Authentication service is unavailable')
      }
    }

    return this.toIssuedSession(
      this.toActor(user),
      accessCredential,
      refreshCredential.refreshToken,
      refreshCredential.dateTimeExpiration,
    )
  }

  async verifySession(accessToken: string): Promise<AuthenticatedActor> {
    const claims = await this.tokenService.verifyAccessToken(accessToken)
    let session: SessionDocument | null
    try {
      session = await this.sessionModel
        .findOne({
          userId: claims.sub,
          dateTimeExpiration: { $gt: new Date() },
          dateTimeRevoked: null,
          sessionKey: claims.sid,
          tokenType: TokenType.REFRESH,
        })
        .exec()
    } catch {
      throw new ServiceUnavailableException('Authentication service is unavailable')
    }
    if (!session) throw invalidSession()
    return this.findSessionActor(claims.sub, session.credentialVersion)
  }

  async postSessionRefresh(claims: RefreshTokenClaims): Promise<IssuedSession> {
    const dateTimeNow = new Date()
    let session: SessionDocument | null
    try {
      session = await this.sessionModel
        .findOne({
          userId: claims.sub,
          dateTimeExpiration: { $gt: dateTimeNow },
          dateTimeRevoked: null,
          jti: claims.jti,
          sessionKey: claims.sid,
          tokenType: TokenType.REFRESH,
        })
        .exec()
    } catch {
      throw new ServiceUnavailableException('Authentication service is unavailable')
    }
    if (!session) throw invalidSession()

    const actor = await this.findSessionActor(claims.sub, session.credentialVersion)
    const maximumExpiration = new Date(
      session.createdAt.getTime() + SESSION_MAXIMUM_TTL_MILLISECONDS,
    )
    const rollingExpiration = new Date(dateTimeNow.getTime() + REFRESH_TOKEN_TTL_MILLISECONDS)
    const requestedDateTimeExpiration = new Date(
      Math.min(rollingExpiration.getTime(), maximumExpiration.getTime()),
    )
    if (requestedDateTimeExpiration <= dateTimeNow) throw invalidSession()

    const nextJti = randomUUID()
    const refreshCredential = await this.tokenService.issueRefreshToken(
      actor.userId.toHexString(),
      session.sessionKey,
      nextJti,
      requestedDateTimeExpiration,
    )
    const accessCredential = await this.tokenService.issueAccessToken(
      actor.userId.toHexString(),
      session.sessionKey,
    )

    let updatedSession: SessionDocument | null
    try {
      updatedSession = await this.sessionModel
        .findOneAndUpdate(
          {
            _id: session._id,
            dateTimeExpiration: { $gt: dateTimeNow },
            dateTimeRevoked: null,
            jti: claims.jti,
            sessionKey: claims.sid,
            tokenType: TokenType.REFRESH,
          },
          {
            $set: {
              dateTimeExpiration: refreshCredential.dateTimeExpiration,
              jti: nextJti,
            },
          },
          { returnDocument: 'after', runValidators: true },
        )
        .exec()
    } catch {
      throw new ServiceUnavailableException('Authentication service is unavailable')
    }
    if (!updatedSession) throw invalidSession()

    return this.toIssuedSession(
      actor,
      accessCredential,
      refreshCredential.refreshToken,
      updatedSession.dateTimeExpiration,
    )
  }

  async deleteSession(claims: RefreshTokenClaims): Promise<void> {
    let result: { matchedCount: number }
    try {
      result = await this.sessionModel
        .updateOne(
          {
            userId: claims.sub,
            dateTimeExpiration: { $gt: new Date() },
            dateTimeRevoked: null,
            jti: claims.jti,
            sessionKey: claims.sid,
            tokenType: TokenType.REFRESH,
          },
          { $set: { dateTimeRevoked: new Date() } },
        )
        .exec()
    } catch {
      throw new ServiceUnavailableException('Authentication service is unavailable')
    }
    if (result.matchedCount === 0) throw invalidSession()
  }

  async revokeAllForUser(userId: string | Types.ObjectId): Promise<void> {
    try {
      await this.sessionModel.deleteMany({ userId }).exec()
    } catch {
      throw new ServiceUnavailableException('Authentication service is unavailable')
    }
  }

  private async replaceSession(
    replacement: {
      userId: Types.ObjectId
      credentialVersion: number
      dateTimeExpiration: Date
      dateTimeRevoked: null
      jti: string
      sessionKey: string
      tokenType: TokenType.REFRESH
    },
    upsert: boolean,
  ): Promise<void> {
    const session = await this.sessionModel
      .findOneAndReplace({ userId: replacement.userId }, replacement, {
        returnDocument: 'after',
        runValidators: true,
        upsert,
      })
      .exec()
    if (!session) throw new ServiceUnavailableException('Authentication service is unavailable')
  }

  private async findSessionActor(
    userId: string | Types.ObjectId,
    credentialVersion: number,
  ): Promise<AuthenticatedActor> {
    const user = await this.users.findById(userId)
    if (!user || user.credentialVersion !== credentialVersion) throw invalidSession()
    return this.toActor(user)
  }

  private toActor(user: Parameters<UsersService['toSafeUser']>[0]): AuthenticatedActor {
    return { userId: user._id, user: this.users.toSafeUser(user) }
  }

  private async toIssuedSession(
    actor: AuthenticatedActor,
    accessCredential: { accessToken: string; dateTimeExpiration: Date },
    refreshToken: string,
    dateTimeExpiration: Date,
  ): Promise<IssuedSession> {
    const tenants = await this.tenants.listForUser(actor)
    return {
      dateTimeExpiration,
      refreshToken,
      response: {
        accessToken: accessCredential.accessToken,
        dateTimeExpiration: accessCredential.dateTimeExpiration.toISOString(),
        tokenType: TokenType.ACCESS,
        user: actor.user,
        tenantAccess: tenants.map((tenant) => ({
          tenantId: tenant._id.toHexString(),
          role: actor.user.role,
        })),
      },
    }
  }
}

function isDuplicateKeyError(error: unknown): error is { code: 11000 } {
  return (
    typeof error === 'object' && error !== null && 'code' in error && error.code === 11000
  )
}
