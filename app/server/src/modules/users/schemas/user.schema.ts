import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export enum UserStatus {
  Active = 'ACTIVE',
  Disabled = 'DISABLED',
}

@Schema({ collection: 'users', timestamps: true, versionKey: 'revision' })
export class User {
  @Prop({ required: true, trim: true })
  displayName!: string

  @Prop({ required: true, lowercase: true, trim: true })
  username!: string

  @Prop({ required: true, select: false })
  passwordHash!: string

  @Prop({ required: true, enum: UserStatus, default: UserStatus.Active })
  status!: UserStatus

  @Prop({ required: true, default: 1 })
  credentialVersion!: number

  @Prop({ required: true, default: true })
  shouldChangePassword!: boolean

  createdAt!: Date
  updatedAt!: Date
}

export type UserDocument = HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({ username: 1 }, { unique: true })
