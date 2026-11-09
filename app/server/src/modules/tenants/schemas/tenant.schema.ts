import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

@Schema({ collection: 'tenants', timestamps: true, versionKey: 'revision' })
export class Tenant {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  accountHolderId!: Types.ObjectId

  @Prop({ required: true, trim: true })
  name!: string

  @Prop({ required: true, lowercase: true, trim: true })
  key!: string

  @Prop({ required: true, trim: true, default: 'Asia/Manila' })
  timezone!: string

  @Prop({ required: true, uppercase: true, trim: true, default: 'PHP' })
  currency!: string

  @Prop({ required: true, enum: TenantStatus, default: TenantStatus.ACTIVE })
  status!: TenantStatus

  createdAt!: Date
  updatedAt!: Date
}

export type TenantDocument = HydratedDocument<Tenant>
export const TenantSchema = SchemaFactory.createForClass(Tenant)

TenantSchema.index({ key: 1 }, { unique: true })
TenantSchema.index({ accountHolderId: 1, status: 1, createdAt: 1 })
