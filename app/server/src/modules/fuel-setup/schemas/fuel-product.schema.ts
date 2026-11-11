import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'

export enum FuelSetupStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ collection: 'fuelProducts', timestamps: true, versionKey: 'revision' })
export class FuelProduct {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  tenantId!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  name!: string

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
