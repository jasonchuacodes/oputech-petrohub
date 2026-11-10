import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export enum UserStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Schema({ collection: 'users', timestamps: true, versionKey: 'revision' })
export class User {
  @Prop({ required: true, trim: true, type: String })
  displayName!: string

  @Prop({ required: true, lowercase: true, trim: true, type: String })
  username!: string

  @Prop({ required: true, select: false, type: String })
  passwordHash!: string

  @Prop({ required: true, enum: UserStatus, default: UserStatus.ACTIVE, type: String })
  status!: UserStatus

  @Prop({ required: true, enum: UserRole, type: String })
  role!: UserRole

  @Prop({
    type: Types.ObjectId,
    required: function (this: User) {
      return this.role === UserRole.ADMIN || this.role === UserRole.MEMBER
    },
    validate: {
      validator: function (this: User, value?: Types.ObjectId) {
        return this.role === UserRole.SUPERADMIN ? value === undefined : value !== undefined
      },
      message:
        'accountHolderId is required for admin and member users and forbidden for superadmins',
    },
  })
  accountHolderId?: Types.ObjectId

  @Prop({
    type: [Types.ObjectId],
    default: [],
    validate: {
      validator: function (this: User, value: Types.ObjectId[]) {
        if (this.role === UserRole.SUPERADMIN) return value.length === 0
        if (this.role === UserRole.MEMBER) return value.length === 1
        return value.length >= 1
      },
      message:
        'superadmins cannot have tenant assignments, members require one tenant, and admins require at least one tenant',
    },
  })
  tenantIds!: Types.ObjectId[]

  @Prop({ type: Types.ObjectId })
  currentTenantId?: Types.ObjectId

  @Prop({ required: true, default: 0, type: Number })
  tenantSelectionVersion!: number

  @Prop({ required: true, default: 1, type: Number })
  credentialVersion!: number

  @Prop({ required: true, default: true, type: Boolean })
  shouldChangePassword!: boolean

  createdAt!: Date
  updatedAt!: Date
}

export type UserDocument = HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({ username: 1 }, { unique: true })
UserSchema.index({ accountHolderId: 1, tenantIds: 1, role: 1, status: 1 })
