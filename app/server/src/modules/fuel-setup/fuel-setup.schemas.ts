import { Types } from 'mongoose'
import { z } from 'zod'
import { DEFAULT_FUEL_PRODUCT_COLOR, FuelProductColor } from './schemas/fuel-product.schema'

const priceSchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/).refine((value) => Number(value) > 0)
const readingSchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,3})?$/)
const fuelProductColorSchema = z.enum([
  FuelProductColor.GRAY,
  FuelProductColor.ORANGE,
  FuelProductColor.GREEN,
  FuelProductColor.RED,
  FuelProductColor.YELLOW,
])

export const createFuelProductInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  color: fuelProductColorSchema.default(DEFAULT_FUEL_PRODUCT_COLOR),
  unitPrice: priceSchema,
}).strict()
export type CreateFuelProductInput = z.infer<typeof createFuelProductInputSchema>

export const updateFuelProductInputSchema = createFuelProductInputSchema.extend({
  productId: z.instanceof(Types.ObjectId),
  expectedRevision: z.number().int().min(0),
  color: fuelProductColorSchema.optional(),
}).omit({ unitPrice: true }).strict()
export type UpdateFuelProductInput = z.infer<typeof updateFuelProductInputSchema>

export const changeFuelPriceInputSchema = z.object({
  productId: z.instanceof(Types.ObjectId),
  expectedRevision: z.number().int().min(0),
  unitPrice: priceSchema,
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  effectiveHour: z.number().int().min(0).max(23),
}).strict()
export type ChangeFuelPriceInput = z.infer<typeof changeFuelPriceInputSchema>

export const cancelFuelPriceChangeInputSchema = z.object({
  productId: z.instanceof(Types.ObjectId),
  expectedRevision: z.number().int().min(0),
  effectiveAt: z.iso.datetime(),
}).strict()
export type CancelFuelPriceChangeInput = z.infer<typeof cancelFuelPriceChangeInputSchema>

export const createPumpMeterInputSchema = z.object({
  label: z.string().trim().min(1).max(80),
  productId: z.instanceof(Types.ObjectId),
  initialReading: readingSchema,
}).strict()
export type CreatePumpMeterInput = z.infer<typeof createPumpMeterInputSchema>

export const updatePumpMeterInputSchema = createPumpMeterInputSchema.extend({
  meterId: z.instanceof(Types.ObjectId),
  expectedRevision: z.number().int().min(0),
  currentReading: readingSchema,
  expectedCurrentReading: readingSchema,
}).omit({ productId: true, initialReading: true }).strict()
export type UpdatePumpMeterInput = z.infer<typeof updatePumpMeterInputSchema>

export const createFuelTankInputSchema = z.object({
  label: z.string().trim().min(1).max(80),
  productId: z.instanceof(Types.ObjectId),
}).strict()
export type CreateFuelTankInput = z.infer<typeof createFuelTankInputSchema>

export const updateFuelTankInputSchema = z.object({
  tankId: z.instanceof(Types.ObjectId),
  expectedRevision: z.number().int().min(0),
  label: z.string().trim().min(1).max(80),
  currentReading: readingSchema.nullish().transform((value) => value ?? null),
  expectedCurrentReading: readingSchema.nullish().transform((value) => value ?? null),
}).strict()
export type UpdateFuelTankInput = z.infer<typeof updateFuelTankInputSchema>

export const deactivateFuelSetupInputSchema = z.object({
  id: z.instanceof(Types.ObjectId),
  expectedRevision: z.number().int().min(0),
}).strict()
export type DeactivateFuelSetupInput = z.infer<typeof deactivateFuelSetupInputSchema>
