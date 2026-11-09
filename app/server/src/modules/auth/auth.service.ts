import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify, hash } from 'argon2'
import { Response } from 'express'
import { Environment } from '../../config/environment'
import { invalidCredentials } from '../../common/exceptions/errors'
import { MembershipsService } from '../memberships/memberships.service'
import { UsersService } from '../users/users.service'
import { AuthenticatedActor } from './auth.types'
import { ChangePasswordInput, LoginInput } from './auth.schemas'
import { SessionService } from './session.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly memberships: MembershipsService,
    private readonly sessions: SessionService,
    private readonly config: ConfigService<Environment, true>,
  ) {}

  async login(input: LoginInput, response: Response) {
    const user = await this.users.findForAuthentication(input.username)
    if (!user || !(await verify(user.passwordHash, input.password))) throw invalidCredentials()

    const { session, sessionToken, csrfToken } = await this.sessions.create(
      user._id,
      user.credentialVersion,
    )
    this.setSessionCookie(response, sessionToken, session.expiresAt)

    const memberships = await this.memberships.findActiveForUser(user._id)
    return {
      user: this.users.toSafeUser(user),
      memberships: memberships.map((membership) => ({
        id: membership.id,
        tenantId: membership.tenantId.toHexString(),
        role: membership.role,
      })),
      csrfToken,
    }
  }

  async logout(actor: AuthenticatedActor, response: Response): Promise<{ success: true }> {
    await this.sessions.revoke(actor.sessionId)
    response.clearCookie(this.cookieName, this.cookieOptions())
    return { success: true }
  }

  async me(actor: AuthenticatedActor) {
    const memberships = await this.memberships.findActiveForUser(actor.userId)
    return {
      user: actor.user,
      memberships: memberships.map((membership) => ({
        id: membership.id,
        tenantId: membership.tenantId.toHexString(),
        role: membership.role,
      })),
    }
  }

  rotateCsrf(actor: AuthenticatedActor) {
    return this.sessions.rotateCsrf(actor.sessionId)
  }

  async changePassword(actor: AuthenticatedActor, input: ChangePasswordInput) {
    const user = await this.users.findForAuthentication(actor.user.username)
    if (!user || !(await verify(user.passwordHash, input.currentPassword))) throw invalidCredentials()

    const passwordHash = await hash(input.newPassword)
    await this.users.updatePassword(actor.userId, passwordHash)
    await this.sessions.revokeAllForUser(actor.userId)
    return { success: true }
  }

  private setSessionCookie(response: Response, token: string, expires: Date): void {
    response.cookie(this.cookieName, token, { ...this.cookieOptions(), expires })
  }

  private get cookieName(): string {
    return this.config.get('SESSION_COOKIE_NAME', { infer: true })
  }

  private cookieOptions() {
    const production = this.config.get('NODE_ENV', { infer: true }) === 'production'
    return {
      httpOnly: true,
      secure: production,
      sameSite: 'lax' as const,
      path: '/',
    }
  }
}
