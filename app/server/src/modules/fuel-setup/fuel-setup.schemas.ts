import { Types } from 'mongoose'
import { z } from 'zod'

const priceSchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/).refine((value) => Number(value) > 0)
const readingSchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,3})?$/)

export const createFuelProductInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  unitPrice: priceSchema,
}).strict()
export type CreateFuelProductInput = z.infer<typeof createFuelProductInputSchema>

export const updateFuelProductInputSchema = createFuelProductInputSchema.extend({
  productId: z.instanceof(Types.ObjectId),
  expectedRevision: z.number().int().min(0),
}).strict()
export type UpdateFuelProductInput = z.infer<typeof updateFuelProductInputSchema>

export const createPumpMeterInputSchema = z.object({
  label: z.string().trim().min(1).max(80),
  productId: z.instanceof(Types.ObjectId),
  initialReading: readingSchema,
}).strict()
export type CreatePumpMeterInput = z.infer<typeof createPumpMeterInputSchema>

export const updatePumpMeterInputSchema = createPumpMeterInputSchema.extend({
  meterId: z.instanceof(Types.ObjectId),
  expectedRevision: z.number().int().min(0),
}).omit({ productId: true, initialReading: true }).strict()
export type UpdatePumpMeterInput = z.infer<typeof updatePumpMeterInputSchema>

export const deactivateFuelSetupInputSchema = z.object({
  id: z.instanceof(Types.ObjectId),
  expectedRevision: z.number().int().min(0),
}).strict()
export type DeactivateFuelSetupInput = z.infer<typeof deactivateFuelSetupInputSchema>
