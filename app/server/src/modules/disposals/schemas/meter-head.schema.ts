import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'

@Schema({ collection: 'meterHeads', timestamps: true, versionKey: 'revision' })
export class MeterHead {
  @Prop({ required: true, type: Types.ObjectId, index: true }) tenantId!: Types.ObjectId
  @Prop({ required: true, type: Types.ObjectId }) meterId!: Types.ObjectId
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 }) reading!: Types.Decimal128
  @Prop({ type: Types.ObjectId }) sourceBatchId?: Types.ObjectId
  revision!: number
  createdAt!: Date
  updatedAt!: Date
}

export type MeterHeadDocument = HydratedDocument<MeterHead>
export const MeterHeadSchema = SchemaFactory.createForClass(MeterHead)
MeterHeadSchema.index({ tenantId: 1, meterId: 1 }, { unique: true })
