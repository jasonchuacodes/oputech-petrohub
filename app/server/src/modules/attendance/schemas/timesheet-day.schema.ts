import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'

@Schema({ collection: 'timesheetDays', timestamps: true, versionKey: false })
export class TimesheetDay {
  @Prop({ required: true, type: Types.ObjectId })
  tenantId!: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId })
  userId!: Types.ObjectId

  @Prop({ required: true, match: /^\d{4}-\d{2}-\d{2}$/, type: String })
  localDate!: string

  @Prop({ default: null, type: MongooseSchema.Types.Decimal128 })
  overrideHours!: Types.Decimal128 | null

  @Prop({ required: true, type: Types.ObjectId })
  updatedById!: Types.ObjectId

  @Prop({ required: true, default: 1, type: Number })
  revision!: number

  createdAt!: Date
  updatedAt!: Date
}

export type TimesheetDayDocument = HydratedDocument<TimesheetDay>
export const TimesheetDaySchema = SchemaFactory.createForClass(TimesheetDay)

TimesheetDaySchema.index({ tenantId: 1, userId: 1, localDate: 1 }, { unique: true })
