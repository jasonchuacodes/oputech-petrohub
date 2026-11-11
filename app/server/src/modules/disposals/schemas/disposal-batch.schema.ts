import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'

export enum DisposalBatchStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  REVOKED = 'revoked',
}

@Schema({ _id: false, versionKey: false })
export class DisposalReading {
  @Prop({ required: true, type: Types.ObjectId }) meterId!: Types.ObjectId
  @Prop({ required: true, trim: true, type: String }) meterLabel!: string
  @Prop({ required: true, type: Types.ObjectId }) productId!: Types.ObjectId
  @Prop({ required: true, trim: true, type: String }) productName!: string
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 }) unitPrice!: Types.Decimal128
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 }) openingReading!: Types.Decimal128
  @Prop({ type: Types.ObjectId }) openingSourceBatchId?: Types.ObjectId
  @Prop({ required: true, min: 0, type: Number }) openingHeadRevision!: number
  @Prop({ type: MongooseSchema.Types.Decimal128 }) closingReading?: Types.Decimal128
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 }) calibration!: Types.Decimal128
  @Prop({ type: MongooseSchema.Types.Decimal128 }) netVolume?: Types.Decimal128
  @Prop({ type: MongooseSchema.Types.Decimal128 }) sales?: Types.Decimal128
}

const DisposalReadingSchema = SchemaFactory.createForClass(DisposalReading)

@Schema({ collection: 'disposalBatches', timestamps: true, versionKey: 'revision' })
export class DisposalBatch {
  @Prop({ required: true, type: Types.ObjectId, index: true }) tenantId!: Types.ObjectId
  @Prop({ required: true, type: Types.ObjectId, unique: true }) reportId!: Types.ObjectId
  @Prop({ required: true, type: String }) businessDate!: string
  @Prop({ required: true, type: Types.ObjectId }) shiftId!: Types.ObjectId
  @Prop({ required: true, enum: DisposalBatchStatus, default: DisposalBatchStatus.DRAFT, type: String }) status!: DisposalBatchStatus
  @Prop({ type: Types.ObjectId }) predecessorBatchId?: Types.ObjectId
  @Prop({ type: Types.ObjectId }) successorBatchId?: Types.ObjectId
  @Prop({ required: true, default: [], type: [DisposalReadingSchema] }) readings!: DisposalReading[]
  @Prop({ type: MongooseSchema.Types.Decimal128 }) pumpSales?: Types.Decimal128
  @Prop({ required: true, default: false, type: Boolean }) complete!: boolean
  @Prop({ required: true, default: [], type: [String] }) blockingIssues!: string[]
  @Prop({ type: Date }) submittedAt?: Date
  @Prop({ type: Date }) revokedAt?: Date
  @Prop({ type: Types.ObjectId }) revokedById?: Types.ObjectId
  @Prop({ trim: true, type: String }) revokedByName?: string
  @Prop({ trim: true, type: String }) revocationReason?: string
  revision!: number
  createdAt!: Date
  updatedAt!: Date
}

export type DisposalBatchDocument = HydratedDocument<DisposalBatch>
export const DisposalBatchSchema = SchemaFactory.createForClass(DisposalBatch)
DisposalBatchSchema.index({ tenantId: 1, reportId: 1 }, { unique: true })
DisposalBatchSchema.index({ tenantId: 1, status: 1, businessDate: -1, createdAt: -1 })
DisposalBatchSchema.index({ tenantId: 1, successorBatchId: 1 })
