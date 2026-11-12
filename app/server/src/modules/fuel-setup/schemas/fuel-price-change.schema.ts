import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'

@Schema({ collection: 'fuelPriceChanges', timestamps: true, versionKey: false })
export class FuelPriceChange {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  tenantId!: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId })
  productId!: Types.ObjectId

  @Prop({ required: true, type: Date })
  effectiveAt!: Date

  @Prop({ required: true, type: String })
  effectiveDate!: string

  @Prop({ required: true, min: 0, max: 23, type: Number })
  effectiveHour!: number

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  unitPrice!: Types.Decimal128

  @Prop({ required: true, type: Types.ObjectId })
  recordedById!: Types.ObjectId

  createdAt!: Date
  updatedAt!: Date
}

export type FuelPriceChangeDocument = HydratedDocument<FuelPriceChange>
export const FuelPriceChangeSchema = SchemaFactory.createForClass(FuelPriceChange)
FuelPriceChangeSchema.index({ tenantId: 1, effectiveAt: 1 })
FuelPriceChangeSchema.index({ tenantId: 1, productId: 1, effectiveAt: -1, createdAt: -1, _id: -1 })

@Schema({ collection: 'fuelPriceStates', timestamps: true, versionKey: 'revision' })
export class FuelPriceState {
  @Prop({ required: true, type: Types.ObjectId, unique: true })
  tenantId!: Types.ObjectId

  revision!: number
  createdAt!: Date
  updatedAt!: Date
}

export type FuelPriceStateDocument = HydratedDocument<FuelPriceState>
export const FuelPriceStateSchema = SchemaFactory.createForClass(FuelPriceState)
