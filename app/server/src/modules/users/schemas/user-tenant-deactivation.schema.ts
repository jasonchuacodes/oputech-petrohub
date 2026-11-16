import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export enum UserDeactivationReason {
  RESIGN = 'resign',
  TERMINATED = 'terminated',
  OTHER = 'other',
}

@Schema({ _id: false })
export class UserTenantDeactivation {
  @Prop({ required: true, type: Types.ObjectId })
  tenantId!: Types.ObjectId

  @Prop({ required: true, enum: UserDeactivationReason, type: String })
  reason!: UserDeactivationReason

  @Prop({ trim: true, maxlength: 500, type: String })
  details?: string

  @Prop({ required: true, type: String })
  effectiveDate!: string

  @Prop({ required: true, type: String })
  timezone!: string

  @Prop({ required: true, type: Date })
  effectiveAt!: Date

  @Prop({ required: true, type: Date })
  recordedAt!: Date

  @Prop({ required: true, type: Types.ObjectId })
  recordedById!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  recordedByName!: string
}

export const UserTenantDeactivationSchema = SchemaFactory.createForClass(UserTenantDeactivation)
