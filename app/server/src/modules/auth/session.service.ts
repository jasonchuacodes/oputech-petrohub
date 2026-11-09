import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Environment } from '../../config/environment'
import { createOpaqueToken, hashToken } from '../../common/crypto/tokens'
import { UsersService } from '../users/users.service'
import { AuthenticatedActor } from './auth.types'
import { Session, SessionDocument } from './schemas/session.schema'

const SEEN_WRITE_INTERVAL_MS = 15 * 60 * 1000

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private readonly sessions: Model<Session>,
    private readonly users: UsersService,
    private readonly config: ConfigService<Environment, true>,
  ) {}

  async create(userId: Types.ObjectId, credentialVersion: number) {
    const sessionToken = createOpaqueToken()
    const csrfToken = createOpaqueToken()
    const now = new Date()
    const absoluteTtl = this.config.get('SESSION_ABSOLUTE_TTL_HOURS', { infer: true }) * 3_600_000
    const idleTtl = this.config.get('SESSION_IDLE_TTL_HOURS', { infer: true }) * 3_600_000
    const expiresAt = new Date(now.getTime() + absoluteTtl)
    const idleExpiresAt = new Date(Math.min(expiresAt.getTime(), now.getTime() + idleTtl))

    const session = await this.sessions.create({
      userId,
      tokenHash: hashToken(sessionToken),
      csrfTokenHash: hashToken(csrfToken),
      credentialVersion,
      expiresAt,
      idleExpiresAt,
      lastSeenAt: now,
    })

    return { session, sessionToken, csrfToken }
  }

  async authenticate(sessionToken?: string): Promise<AuthenticatedActor | null> {
    if (!sessionToken) return null

    const now = new Date()
    const session = await this.sessions
      .findOne({
        tokenHash: hashToken(sessionToken),
        revokedAt: { $exists: false },
        expiresAt: { $gt: now },
        idleExpiresAt: { $gt: now },
      })
      .select('+csrfTokenHash')
      .exec()
    if (!session) return null

    const user = await this.users.findActiveById(session.userId)
    if (!user || user.credentialVersion !== session.credentialVersion) {
      await this.revoke(session.id)
      return null
    }

    if (now.getTime() - session.lastSeenAt.getTime() >= SEEN_WRITE_INTERVAL_MS) {
      await this.touch(session, now)
    }

    return {
      userId: user._id,
      sessionId: session._id,
      csrfTokenHash: session.csrfTokenHash,
      user: this.users.toSafeUser(user),
    }
  }

  async rotateCsrf(sessionId: Types.ObjectId): Promise<string> {
    const csrfToken = createOpaqueToken()
    await this.sessions.updateOne(
      { _id: sessionId, revokedAt: { $exists: false } },
      { $set: { csrfTokenHash: hashToken(csrfToken) } },
    )
    return csrfToken
  }

  async revoke(sessionId: Types.ObjectId | string): Promise<void> {
    await this.sessions.updateOne(
      { _id: sessionId, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date() } },
    )
  }

  async revokeAllForUser(userId: Types.ObjectId): Promise<void> {
    await this.sessions.updateMany(
      { userId, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date() } },
    )
  }

  private async touch(session: SessionDocument, now: Date): Promise<void> {
    const idleTtl = this.config.get('SESSION_IDLE_TTL_HOURS', { infer: true }) * 3_600_000
    await this.sessions.updateOne(
      { _id: session._id, revokedAt: { $exists: false } },
      {
        $set: {
          lastSeenAt: now,
          idleExpiresAt: new Date(Math.min(session.expiresAt.getTime(), now.getTime() + idleTtl)),
        },
      },
    )
  }
}
