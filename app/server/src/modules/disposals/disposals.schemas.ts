import { Types } from 'mongoose'
import { z } from 'zod'

const meterDecimalSchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,3})?$/)

export const editableDisposalInputSchema = z.object({
  meterId: z.instanceof(Types.ObjectId),
  closingReading: meterDecimalSchema.nullable(),
  calibration: meterDecimalSchema,
}).strict()

export type EditableDisposalInput = z.infer<typeof editableDisposalInputSchema>
