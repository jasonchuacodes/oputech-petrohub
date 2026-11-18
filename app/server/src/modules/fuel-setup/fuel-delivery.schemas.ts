import { Types } from 'mongoose'
import { z } from 'zod'

const decimalSchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,3})?$/)
const positiveDecimalSchema = decimalSchema.refine((value) => Number(value) >= 0)
const localDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
})
const optionalNotesSchema = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.string().trim().max(1000).nullish(),
).transform((value) => value ?? undefined)

export const fuelDeliveriesInputSchema = z.object({
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
}).strict()
export type FuelDeliveriesInput = z.infer<typeof fuelDeliveriesInputSchema>

const deliveryLineSchema = z.object({
  productId: z.instanceof(Types.ObjectId),
  quantity: positiveDecimalSchema,
}).strict()

const tankReadingSchema = z.object({
  tankId: z.instanceof(Types.ObjectId),
  beforeReading: decimalSchema,
  afterReading: decimalSchema,
}).strict()

const deliveryValuesSchema = z.object({
  deliveryDate: localDateSchema,
  lines: z.array(deliveryLineSchema).min(1).max(50),
  readings: z.array(tankReadingSchema).min(1).max(100),
  notes: optionalNotesSchema,
})

export const createFuelDeliveryInputSchema = deliveryValuesSchema.extend({
  idempotencyKey: z.string().trim().min(8).max(100),
}).strict()
export type CreateFuelDeliveryInput = z.infer<typeof createFuelDeliveryInputSchema>

export const updateFuelDeliveryInputSchema = deliveryValuesSchema.extend({
  deliveryId: z.instanceof(Types.ObjectId),
  expectedRevision: z.number().int().min(0),
}).strict()
export type UpdateFuelDeliveryInput = z.infer<typeof updateFuelDeliveryInputSchema>

export const deleteFuelDeliveryInputSchema = z.object({
  deliveryId: z.instanceof(Types.ObjectId),
  expectedRevision: z.number().int().min(0),
}).strict()
export type DeleteFuelDeliveryInput = z.infer<typeof deleteFuelDeliveryInputSchema>
