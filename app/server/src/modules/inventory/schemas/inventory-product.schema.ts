import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'

export enum InventoryProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ collection: 'inventoryProducts', timestamps: true, versionKey: 'revision' })
export class InventoryProduct {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  tenantId!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  name!: string

  @Prop({ required: true, trim: true, type: String })
  unit!: string

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  unitPrice!: Types.Decimal128

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  stockCount!: Types.Decimal128

  @Prop({ required: true, enum: InventoryProductStatus, default: InventoryProductStatus.ACTIVE, type: String })
  status!: InventoryProductStatus

  revision!: number
  createdAt!: Date
  updatedAt!: Date
}

export type InventoryProductDocument = HydratedDocument<InventoryProduct>
export const InventoryProductSchema = SchemaFactory.createForClass(InventoryProduct)

InventoryProductSchema.index({ tenantId: 1, status: 1, name: 1, _id: 1 })
