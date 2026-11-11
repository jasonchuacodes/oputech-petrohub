import { z } from 'zod'

const priceSchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/, 'Use up to 2 decimal places').refine((value) => Number(value) > 0, 'Price must be greater than zero')
const wholeStockSchema = z.string().regex(/^-?(?:0|[1-9]\d*)$/, 'Use a whole number')
const positiveQuantitySchema = z.string().regex(/^[1-9]\d*$/, 'Quantity must be a whole number greater than zero')

export const inventoryProductFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  unit: z.string().trim().min(1, 'Unit is required').max(40),
  unitPrice: priceSchema,
  openingStock: wholeStockSchema,
})
export type InventoryProductFormValues = z.infer<typeof inventoryProductFormSchema>

export const stockMovementFormSchema = z.object({
  type: z.enum(['stock_in', 'stock_out']),
  quantity: positiveQuantitySchema,
  reason: z.string().trim().min(3, 'Enter at least 3 characters').max(240),
})
export type StockMovementFormValues = z.infer<typeof stockMovementFormSchema>
