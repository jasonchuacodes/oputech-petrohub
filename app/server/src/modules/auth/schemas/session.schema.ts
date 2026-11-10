import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'
import { TokenType } from '../token-type.enum'

@Schema({ collection: 'sessions', timestamps: true, versionKey: false })
export class Session {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  userId!: Types.ObjectId

  @Prop({ required: true, type: String })
  sessionKey!: string

  @Prop({ required: true, min: 0, type: Number })
  credentialVersion!: number

  @Prop({ required: true, enum: [TokenType.REFRESH], type: String })
  tokenType!: TokenType.REFRESH

  @Prop({ required: true, type: String })
  jti!: string

  @Prop({ required: true, type: Date })
  dateTimeExpiration!: Date

  @Prop({ default: null, type: Date })
  dateTimeRevoked!: Date | null

  createdAt!: Date
  updatedAt!: Date
}

export type SessionDocument = HydratedDocument<Session>
export const SessionSchema = SchemaFactory.createForClass(Session)

SessionSchema.index({ userId: 1 }, { unique: true })
SessionSchema.index({ dateTimeExpiration: 1 }, { expireAfterSeconds: 0 })
