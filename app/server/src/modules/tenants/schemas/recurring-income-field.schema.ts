import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema({ _id: false, versionKey: false })
export class RecurringIncomeField {
  @Prop({ required: true, type: Types.ObjectId })
  id!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  description!: string

  @Prop({ required: true, default: true, type: Boolean })
  active!: boolean
}

export const RecurringIncomeFieldSchema = SchemaFactory.createForClass(RecurringIncomeField)
