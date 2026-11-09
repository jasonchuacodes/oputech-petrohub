import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

@Schema({ collection: 'sessions', timestamps: true, versionKey: false })
export class Session {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  userId!: Types.ObjectId

  @Prop({ required: true, select: false })
  tokenHash!: string

  @Prop({ required: true, select: false })
  csrfTokenHash!: string

  @Prop({ required: true })
  credentialVersion!: number

  @Prop({ required: true })
  expiresAt!: Date

  @Prop({ required: true })
  idleExpiresAt!: Date

  @Prop({ required: true, default: Date.now })
  lastSeenAt!: Date

  @Prop()
  revokedAt?: Date

  createdAt!: Date
  updatedAt!: Date
}

export type SessionDocument = HydratedDocument<Session>
export const SessionSchema = SchemaFactory.createForClass(Session)

SessionSchema.index({ tokenHash: 1 }, { unique: true })
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
SessionSchema.index({ userId: 1, expiresAt: 1 })
