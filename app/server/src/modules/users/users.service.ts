import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { User, UserDocument, UserStatus } from './schemas/user.schema'

export type SafeUser = Pick<
  User,
  'displayName' | 'username' | 'status' | 'credentialVersion' | 'shouldChangePassword'
> & { id: string }

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly users: Model<User>) {}

  findForAuthentication(username: string): Promise<UserDocument | null> {
    return this.users
      .findOne({ username: username.trim().toLowerCase(), status: UserStatus.Active })
      .select('+passwordHash')
      .exec()
  }

  findActiveById(userId: Types.ObjectId | string): Promise<UserDocument | null> {
    return this.users.findOne({ _id: userId, status: UserStatus.Active }).exec()
  }

  async create(input: {
    displayName: string
    username: string
    passwordHash: string
    shouldChangePassword?: boolean
  }): Promise<UserDocument> {
    return this.users.create({
      ...input,
      username: input.username.trim().toLowerCase(),
      status: UserStatus.Active,
    })
  }

  async updatePassword(userId: Types.ObjectId, passwordHash: string): Promise<void> {
    await this.users.updateOne(
      { _id: userId, status: UserStatus.Active },
      {
        $set: { passwordHash, shouldChangePassword: false },
        $inc: { credentialVersion: 1 },
      },
    )
  }

  toSafeUser(user: UserDocument): SafeUser {
    return {
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      status: user.status,
      credentialVersion: user.credentialVersion,
      shouldChangePassword: user.shouldChangePassword,
    }
  }
}
