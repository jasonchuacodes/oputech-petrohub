import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export enum MembershipRole {
  Admin = 'ADMIN',
  Employee = 'EMPLOYEE',
}

export enum MembershipStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

@Schema({ collection: 'memberships', timestamps: true, versionKey: 'revision' })
export class Membership {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  tenantId!: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId, index: true })
  userId!: Types.ObjectId

  @Prop({ required: true, enum: MembershipRole })
  role!: MembershipRole

  @Prop({ required: true, enum: MembershipStatus, default: MembershipStatus.Active })
  status!: MembershipStatus

  @Prop({ required: true, trim: true })
  employeeCode!: string

  @Prop({ type: Types.ObjectId })
  shiftId?: Types.ObjectId

  createdAt!: Date
  updatedAt!: Date
}

export type MembershipDocument = HydratedDocument<Membership>
export const MembershipSchema = SchemaFactory.createForClass(Membership)

MembershipSchema.index({ tenantId: 1, userId: 1 }, { unique: true })
MembershipSchema.index({ tenantId: 1, employeeCode: 1 }, { unique: true })
MembershipSchema.index({ tenantId: 1, status: 1, role: 1 })
