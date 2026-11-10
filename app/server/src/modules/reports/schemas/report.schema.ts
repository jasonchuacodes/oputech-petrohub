import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export enum ReportStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
}

@Schema({ _id: false, versionKey: false })
export class ReportIntervalSnapshot {
  @Prop({ required: true, type: String })
  startTime!: string

  @Prop({ required: true, type: String })
  endTime!: string

  @Prop({ required: true, type: String })
  timezone!: string
}

const ReportIntervalSnapshotSchema = SchemaFactory.createForClass(ReportIntervalSnapshot)

@Schema({ collection: 'reports', timestamps: true, versionKey: 'revision' })
export class Report {
  @Prop({ required: true, type: Types.ObjectId })
  tenantId!: Types.ObjectId

  @Prop({ required: true, type: String })
  businessDate!: string

  @Prop({ required: true, type: Types.ObjectId })
  shiftId!: Types.ObjectId

  @Prop({ required: true, type: ReportIntervalSnapshotSchema })
  interval!: ReportIntervalSnapshot

  @Prop({ required: true, type: Types.ObjectId })
  creatorId!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  creatorName!: string

  @Prop({ required: true, enum: ReportStatus, default: ReportStatus.DRAFT, type: String })
  status!: ReportStatus

  @Prop({ type: Date })
  submittedAt?: Date

  @Prop({ type: Types.ObjectId })
  submittedById?: Types.ObjectId

  @Prop({ trim: true, type: String })
  submittedByName?: string

  revision!: number
  createdAt!: Date
  updatedAt!: Date
}

export type ReportDocument = HydratedDocument<Report>
export const ReportSchema = SchemaFactory.createForClass(Report)

ReportSchema.index({ tenantId: 1, businessDate: 1, shiftId: 1 }, { unique: true })
ReportSchema.index({ tenantId: 1, businessDate: -1, createdAt: -1, _id: -1 })
