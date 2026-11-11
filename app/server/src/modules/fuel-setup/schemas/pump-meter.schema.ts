import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'
import { FuelSetupStatus } from './fuel-product.schema'

@Schema({ collection: 'pumpMeters', timestamps: true, versionKey: 'revision' })
export class PumpMeter {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  tenantId!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  label!: string

  @Prop({ required: true, type: Types.ObjectId })
  productId!: Types.ObjectId

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  initialReading!: Types.Decimal128

  @Prop({ required: true, enum: FuelSetupStatus, default: FuelSetupStatus.ACTIVE, type: String })
  status!: FuelSetupStatus

  revision!: number
  createdAt!: Date
  updatedAt!: Date
}

export type PumpMeterDocument = HydratedDocument<PumpMeter>
export const PumpMeterSchema = SchemaFactory.createForClass(PumpMeter)
PumpMeterSchema.index({ tenantId: 1, label: 1 })
