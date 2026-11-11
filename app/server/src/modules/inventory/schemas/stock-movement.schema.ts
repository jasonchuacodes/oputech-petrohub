import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'

export enum StockMovementType {
  OPENING = 'opening',
  STOCK_IN = 'stock_in',
  STOCK_OUT = 'stock_out',
  REPORT_SALE = 'report_sale',
  REPORT_REVERSAL = 'report_reversal',
}

@Schema({ collection: 'stockMovements', timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class StockMovement {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  tenantId!: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId, index: true })
  productId!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  productName!: string

  @Prop({ required: true, trim: true, type: String })
  unit!: string

  @Prop({ required: true, enum: StockMovementType, type: String })
  type!: StockMovementType

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  quantityChange!: Types.Decimal128

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  balanceBefore!: Types.Decimal128

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  balanceAfter!: Types.Decimal128

  @Prop({ trim: true, type: String })
  reason?: string

  @Prop({ required: true, type: Types.ObjectId })
  actorId!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  actorName!: string

  @Prop({ type: Types.ObjectId })
  reportId?: Types.ObjectId

  @Prop({ type: Types.ObjectId })
  originalMovementId?: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  idempotencyKey!: string

  createdAt!: Date
}

export type StockMovementDocument = HydratedDocument<StockMovement>
export const StockMovementSchema = SchemaFactory.createForClass(StockMovement)

StockMovementSchema.index({ tenantId: 1, productId: 1, createdAt: -1, _id: -1 })
StockMovementSchema.index({ tenantId: 1, idempotencyKey: 1 }, { unique: true })
StockMovementSchema.index({ tenantId: 1, reportId: 1, type: 1 })
