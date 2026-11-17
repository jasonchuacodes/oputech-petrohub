import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { FuelSetupStatus } from './fuel-product.schema'

@Schema({ collection: 'fuelTanks', timestamps: true, versionKey: 'revision' })
export class FuelTank {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  tenantId!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  label!: string

  @Prop({ required: true, type: Types.ObjectId })
  productId!: Types.ObjectId

  @Prop({ required: true, enum: FuelSetupStatus, default: FuelSetupStatus.ACTIVE, type: String })
  status!: FuelSetupStatus

  revision!: number
  createdAt!: Date
  updatedAt!: Date
}

export type FuelTankDocument = HydratedDocument<FuelTank>
export const FuelTankSchema = SchemaFactory.createForClass(FuelTank)
FuelTankSchema.index({ tenantId: 1, label: 1 })
