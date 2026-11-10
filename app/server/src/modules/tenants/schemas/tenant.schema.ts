import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { Shift, ShiftSchema } from './shift.schema'

export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

@Schema({ collection: 'tenants', timestamps: true, versionKey: 'revision' })
export class Tenant {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  accountHolderId!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  name!: string

  @Prop({ required: true, trim: true, default: 'Asia/Manila', type: String })
  timezone!: string

  @Prop({ required: true, uppercase: true, trim: true, default: 'PHP', type: String })
  currency!: string

  @Prop({ required: true, enum: TenantStatus, default: TenantStatus.ACTIVE, type: String })
  status!: TenantStatus

  @Prop({ default: [], type: [ShiftSchema] })
  shifts!: Shift[]

  createdAt!: Date
  updatedAt!: Date
}

export type TenantDocument = HydratedDocument<Tenant>
export const TenantSchema = SchemaFactory.createForClass(Tenant)

TenantSchema.index({ accountHolderId: 1, status: 1, createdAt: 1 })
