import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export enum ActivityEntityType {
  REPORT = 'report',
}

@Schema({
  collection: 'memberActivities',
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
})
export class MemberActivity {
  @Prop({ required: true, type: Types.ObjectId })
  tenantId!: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId })
  memberId!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  action!: string

  @Prop({ required: true, enum: ActivityEntityType, type: String })
  entityType!: ActivityEntityType

  @Prop({ required: true, type: Types.ObjectId })
  entityId!: Types.ObjectId

  @Prop({ required: true, type: String })
  eventKey!: string

  createdAt!: Date
}

export type MemberActivityDocument = HydratedDocument<MemberActivity>
export const MemberActivitySchema = SchemaFactory.createForClass(MemberActivity)

MemberActivitySchema.index({ tenantId: 1, eventKey: 1 }, { unique: true })
MemberActivitySchema.index({ tenantId: 1, createdAt: -1 })
MemberActivitySchema.index({ tenantId: 1, memberId: 1, createdAt: -1 })
