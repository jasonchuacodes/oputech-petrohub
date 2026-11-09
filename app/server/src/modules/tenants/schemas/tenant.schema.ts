import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export enum TenantStatus {
  Active = 'ACTIVE',
  Suspended = 'SUSPENDED',
}

@Schema({ collection: 'tenants', timestamps: true, versionKey: 'revision' })
export class Tenant {
  @Prop({ required: true, trim: true })
  name!: string

  @Prop({ required: true, lowercase: true, trim: true })
  key!: string

  @Prop({ required: true, trim: true, default: 'Asia/Manila' })
  timezone!: string

  @Prop({ required: true, uppercase: true, trim: true, default: 'PHP' })
  currency!: string

  @Prop({ required: true, enum: TenantStatus, default: TenantStatus.Active })
  status!: TenantStatus

  createdAt!: Date
  updatedAt!: Date
}

export type TenantDocument = HydratedDocument<Tenant>
export const TenantSchema = SchemaFactory.createForClass(Tenant)

TenantSchema.index({ key: 1 }, { unique: true })
