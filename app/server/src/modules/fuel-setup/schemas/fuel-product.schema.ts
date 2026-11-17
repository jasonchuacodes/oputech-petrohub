import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'

export enum FuelSetupStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum FuelProductColor {
  GRAY = 'gray',
  ORANGE = 'orange',
  GREEN = 'green',
  RED = 'red',
  YELLOW = 'yellow',
}

export const DEFAULT_FUEL_PRODUCT_COLOR = FuelProductColor.GRAY

@Schema({ collection: 'fuelProducts', timestamps: true, versionKey: 'revision' })
export class FuelProduct {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  tenantId!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  name!: string

  @Prop({ required: true, enum: FuelProductColor, default: DEFAULT_FUEL_PRODUCT_COLOR, type: String })
  color!: FuelProductColor

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  unitPrice!: Types.Decimal128

  @Prop({ required: true, enum: FuelSetupStatus, default: FuelSetupStatus.ACTIVE, type: String })
  status!: FuelSetupStatus

  revision!: number
  createdAt!: Date
  updatedAt!: Date
}

export type FuelProductDocument = HydratedDocument<FuelProduct>
export const FuelProductSchema = SchemaFactory.createForClass(FuelProduct)
FuelProductSchema.index({ tenantId: 1, name: 1 })
