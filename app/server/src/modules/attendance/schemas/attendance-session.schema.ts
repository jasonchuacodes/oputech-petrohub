import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

@Schema({ collection: 'attendanceSessions', timestamps: true, versionKey: false })
export class AttendanceSession {
  @Prop({ required: true, type: Types.ObjectId })
  tenantId!: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId })
  userId!: Types.ObjectId

  @Prop({ required: true, type: Date })
  startedAt!: Date

  @Prop({ default: null, type: Date })
  endedAt!: Date | null

  @Prop({ required: true, trim: true, type: String })
  idempotencyKey!: string

  createdAt!: Date
  updatedAt!: Date
}

export type AttendanceSessionDocument = HydratedDocument<AttendanceSession>
export const AttendanceSessionSchema = SchemaFactory.createForClass(AttendanceSession)

AttendanceSessionSchema.index(
  { tenantId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { endedAt: null } },
)
AttendanceSessionSchema.index({ tenantId: 1, userId: 1, idempotencyKey: 1 }, { unique: true })
AttendanceSessionSchema.index({ tenantId: 1, userId: 1, startedAt: 1 })
