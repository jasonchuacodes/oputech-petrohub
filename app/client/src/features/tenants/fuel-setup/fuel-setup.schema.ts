import { z } from 'zod'
import { fuelProductColors } from '../../fuel-products/fuel-product-colors'

export const fuelProductFormSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required').max(80),
  color: z.enum(fuelProductColors),
  unitPrice: z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/, 'Use up to 2 decimal places').refine((value) => Number(value) > 0, 'Price must be greater than zero'),
})
export type FuelProductFormValues = z.infer<typeof fuelProductFormSchema>

export const pumpMeterFormSchema = z.object({
  label: z.string().trim().min(1, 'Meter label is required').max(80),
  productId: z.string().min(1, 'Select a fuel product'),
  initialReading: z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,3})?$/, 'Use up to 3 decimal places'),
  currentReading: z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,3})?$/, 'Use up to 3 decimal places'),
})
export type PumpMeterFormValues = z.infer<typeof pumpMeterFormSchema>

export const fuelTankFormSchema = z.object({
  label: z.string().trim().min(1, 'Tank label is required').max(80),
  productId: z.string().min(1, 'Select a fuel product'),
  currentReading: z.union([
    z.literal(''),
    z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,3})?$/, 'Use up to 3 decimal places'),
  ]),
})
export type FuelTankFormValues = z.infer<typeof fuelTankFormSchema>
