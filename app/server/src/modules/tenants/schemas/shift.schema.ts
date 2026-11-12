import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema({ _id: false, versionKey: false })
export class Shift {
  @Prop({ required: true, type: Types.ObjectId })
  id!: Types.ObjectId

  @Prop({ required: true, trim: true, type: String })
  name!: string

  @Prop({ required: true, type: String })
  startTime!: string

  @Prop({ required: true, type: String })
  endTime!: string
}

export const ShiftSchema = SchemaFactory.createForClass(Shift)
