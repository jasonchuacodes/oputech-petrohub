import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { User, UserDocument, UserRole, UserStatus } from './schemas/user.schema'

export type AuthenticatedUser = Pick<
  User,
  | 'firstName'
  | 'lastName'
  | 'displayFullName'
  | 'username'
  | 'status'
  | 'role'
  | 'shouldChangePassword'
  | 'tenantIds'
  | 'currentTenantId'
  | 'tenantSelectionVersion'
> & { id: Types.ObjectId; accountHolderId?: Types.ObjectId }

type CreateUserBase = {
  firstName?: string
  lastName?: string
  username: string
  passwordHash: string
  shouldChangePassword?: boolean
}

type CreateUserInput =
  | (CreateUserBase & {
      role: UserRole.SUPERADMIN
      accountHolderId?: never
      tenantIds?: never
    })
  | (CreateUserBase & {
      role: UserRole.ADMIN
      accountHolderId: Types.ObjectId
      tenantIds: Types.ObjectId[]
    })
  | (CreateUserBase & {
      role: UserRole.MEMBER
      accountHolderId: Types.ObjectId
      tenantIds: [Types.ObjectId]
    })

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly users: Model<User>) {}

  findByUsername(username: string): Promise<UserDocument | null> {
    return this.users
      .findOne({ username: username.trim().toLowerCase(), status: UserStatus.ACTIVE })
      .select('+passwordHash')
      .exec()
  }

  findById(userId: Types.ObjectId | string): Promise<UserDocument | null> {
    return this.users.findOne({ _id: userId, status: UserStatus.ACTIVE }).exec()
  }

  async usernameExists(username: string): Promise<boolean> {
    return (await this.users.exists({ username: username.trim().toLowerCase() })) !== null
  }

  async create(input: CreateUserInput): Promise<UserDocument> {
    return this.users.create({
      ...input,
      username: input.username.trim().toLowerCase(),
      status: UserStatus.ACTIVE,
      tenantIds: input.tenantIds ?? [],
      currentTenantId: input.role === UserRole.SUPERADMIN ? undefined : input.tenantIds[0],
    })
  }

  async updatePassword(userId: Types.ObjectId, passwordHash: string): Promise<void> {
    await this.users.updateOne(
      { _id: userId, status: UserStatus.ACTIVE },
      {
        $set: { passwordHash, shouldChangePassword: false },
        $inc: { credentialVersion: 1 },
      },
    )
  }

  toAuthenticatedUser(user: UserDocument): AuthenticatedUser {
    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      displayFullName: user.displayFullName,
      username: user.username,
      status: user.status,
      role: user.role,
      accountHolderId: user.accountHolderId,
      tenantIds: user.tenantIds,
      currentTenantId: user.currentTenantId,
      tenantSelectionVersion: user.tenantSelectionVersion,
      shouldChangePassword: user.shouldChangePassword,
    }
  }
}
