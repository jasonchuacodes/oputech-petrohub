import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'

export enum FuelDeliveryEventType {
  DELIVERY = 'delivery',
  MANUAL_OVERRIDE = 'manual_override',
}

@Schema({ _id: false })
export class FuelDeliveryLine {
  @Prop({ required: true, type: Types.ObjectId })
  productId!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  productName!: string

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  quantity!: Types.Decimal128
}

const FuelDeliveryLineSchema = SchemaFactory.createForClass(FuelDeliveryLine)

@Schema({ _id: false })
export class FuelTankReading {
  @Prop({ required: true, type: Types.ObjectId })
  tankId!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  tankLabel!: string

  @Prop({ required: true, type: Types.ObjectId })
  productId!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  productName!: string

  @Prop({ type: MongooseSchema.Types.Decimal128 })
  beforeReading?: Types.Decimal128

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  afterReading!: Types.Decimal128
}

const FuelTankReadingSchema = SchemaFactory.createForClass(FuelTankReading)

@Schema({ collection: 'fuelDeliveries', timestamps: true, versionKey: 'revision' })
export class FuelDelivery {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  tenantId!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  deliveryDate!: string

  @Prop({ required: true, enum: FuelDeliveryEventType, default: FuelDeliveryEventType.DELIVERY, type: String })
  eventType!: FuelDeliveryEventType

  @Prop({ required: true, type: [FuelDeliveryLineSchema] })
  lines!: FuelDeliveryLine[]

  @Prop({ required: true, type: [FuelTankReadingSchema] })
  readings!: FuelTankReading[]

  @Prop({ trim: true, type: String })
  notes?: string

  @Prop({ required: true, type: Types.ObjectId })
  createdById!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  createdByName!: string

  @Prop({ type: Types.ObjectId })
  updatedById?: Types.ObjectId

  @Prop({ trim: true, type: String })
  updatedByName?: string

  @Prop({ type: Date })
  deletedAt?: Date

  @Prop({ type: Types.ObjectId })
  deletedById?: Types.ObjectId

  @Prop({ trim: true, type: String })
  deletedByName?: string

  @Prop({ required: true, trim: true, type: String })
  idempotencyKey!: string

  revision!: number
  createdAt!: Date
  updatedAt!: Date
}

export type FuelDeliveryDocument = HydratedDocument<FuelDelivery>
export const FuelDeliverySchema = SchemaFactory.createForClass(FuelDelivery)
FuelDeliverySchema.index({ tenantId: 1, deliveryDate: -1, createdAt: -1, _id: -1 })
FuelDeliverySchema.index({ tenantId: 1, idempotencyKey: 1 }, { unique: true })
FuelDeliverySchema.index({ tenantId: 1, 'readings.tankId': 1, createdAt: -1, _id: -1 })
