import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'

export enum ReportStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  REVOKED = 'revoked',
}

@Schema({ _id: false, versionKey: false })
export class ReportFinancialEntry {
  @Prop({ required: true, trim: true, type: String }) id!: string
  @Prop({ type: Types.ObjectId }) recurringIncomeFieldId?: Types.ObjectId
  @Prop({ required: true, trim: true, type: String }) description!: string
  @Prop({ trim: true, type: String }) notes?: string
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 }) amount!: Types.Decimal128
}

const ReportFinancialEntrySchema = SchemaFactory.createForClass(ReportFinancialEntry)

@Schema({ _id: false, versionKey: false })
export class ReportLubricantSale {
  @Prop({ required: true, trim: true, type: String }) id!: string
  @Prop({ required: true, type: Types.ObjectId }) productId!: Types.ObjectId
  @Prop({ required: true, trim: true, type: String }) productName!: string
  @Prop({ required: true, trim: true, type: String }) unit!: string
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 }) quantity!: Types.Decimal128
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 }) unitPrice!: Types.Decimal128
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 }) amount!: Types.Decimal128
}

const ReportLubricantSaleSchema = SchemaFactory.createForClass(ReportLubricantSale)

@Schema({ _id: false, versionKey: false })
export class ReportTotals {
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 }) income!: Types.Decimal128
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 }) expenses!: Types.Decimal128
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 }) cashFuelSales!: Types.Decimal128
  @Prop({ type: MongooseSchema.Types.Decimal128 }) pumpSales?: Types.Decimal128
  @Prop({ type: MongooseSchema.Types.Decimal128 }) overShort?: Types.Decimal128
  @Prop({ required: true, default: () => Types.Decimal128.fromString('0'), type: MongooseSchema.Types.Decimal128 }) lubricantSales!: Types.Decimal128
}

const ReportTotalsSchema = SchemaFactory.createForClass(ReportTotals)

@Schema({ _id: false, versionKey: false })
export class ReportIntervalSnapshot {
  @Prop({ required: true, type: String })
  startTime!: string

  @Prop({ required: true, type: String })
  endTime!: string

  @Prop({ required: true, type: String })
  timezone!: string

  @Prop({ required: true, type: Date })
  startAt!: Date

  @Prop({ required: true, type: Date })
  endAt!: Date
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

  @Prop({ required: true, trim: true, type: String })
  shiftName!: string

  @Prop({ required: true, type: String })
  slotId!: string

  @Prop({ required: true, type: ReportIntervalSnapshotSchema })
  interval!: ReportIntervalSnapshot

  @Prop({ required: true, default: 1, type: Number })
  contentVersion!: number

  @Prop({ required: true, uppercase: true, trim: true, default: 'PHP', type: String })
  currency!: string

  @Prop({ type: Types.ObjectId })
  disposalBatchId?: Types.ObjectId

  @Prop({ required: true, default: [], type: [ReportFinancialEntrySchema] })
  incomeEntries!: ReportFinancialEntry[]

  @Prop({ required: true, default: [], type: [ReportFinancialEntrySchema] })
  expenseEntries!: ReportFinancialEntry[]

  @Prop({ required: true, default: [], type: [ReportLubricantSaleSchema] })
  lubricantSales!: ReportLubricantSale[]

  @Prop({
    required: true,
    default: () => ({ income: Types.Decimal128.fromString('0'), expenses: Types.Decimal128.fromString('0'), cashFuelSales: Types.Decimal128.fromString('0'), lubricantSales: Types.Decimal128.fromString('0') }),
    type: ReportTotalsSchema,
  })
  totals!: ReportTotals

  @Prop({ required: true, default: true, type: Boolean })
  effective!: boolean

  @Prop({ required: true, default: false, type: Boolean })
  stale!: boolean

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

  @Prop({ enum: [ReportStatus.DRAFT, ReportStatus.SUBMITTED], type: String })
  revokedFromStatus?: ReportStatus.DRAFT | ReportStatus.SUBMITTED

  @Prop({ type: Date })
  revokedAt?: Date

  @Prop({ type: Types.ObjectId })
  revokedById?: Types.ObjectId

  @Prop({ trim: true, type: String })
  revokedByName?: string

  @Prop({ trim: true, type: String })
  revocationReason?: string

  revision!: number
  createdAt!: Date
  updatedAt!: Date
}

export type ReportDocument = HydratedDocument<Report>
export const ReportSchema = SchemaFactory.createForClass(Report)

ReportSchema.index(
  { tenantId: 1, businessDate: 1, slotId: 1 },
  { name: 'report_effective_segment_unique', unique: true, partialFilterExpression: { effective: true } },
)
ReportSchema.index({ tenantId: 1, businessDate: -1, createdAt: -1, _id: -1 })
