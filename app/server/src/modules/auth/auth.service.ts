import { Injectable } from '@nestjs/common'
import { verify, hash } from 'argon2'
import { ConflictException, InvalidCredentialsException } from '../../common/exceptions'
import { UserRole } from '../users/schemas/user.schema'
import { UsersService } from '../users/users.service'
import { AuthenticatedActor } from './auth.types'
import { ChangePasswordInput, RegisterInput } from './auth.schemas'
import { SessionService } from './session/session.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly sessions: SessionService,
  ) {}

  async register(input: RegisterInput) {
    if (await this.users.usernameExists(input.username)) {
      throw new ConflictException('This username is already in use.')
    }

    const user = await this.users.create({
      username: input.username,
      passwordHash: await hash(input.password),
      role: UserRole.SUPERADMIN,
    })

    return {
      id: user._id,
      username: user.username,
      role: user.role,
    }
  }

  async changePassword(actor: AuthenticatedActor, input: ChangePasswordInput) {
    const user = await this.users.findByUsername(actor.user.username)
    if (!user || !(await verify(user.passwordHash, input.currentPassword))) {
      throw new InvalidCredentialsException()
    }

    const passwordHash = await hash(input.newPassword)
    await this.users.updatePassword(actor.userId, passwordHash)
    await this.sessions.revokeAllForUser(actor.userId)
    return { success: true }
  }
}
