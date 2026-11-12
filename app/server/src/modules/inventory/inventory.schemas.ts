import { Types } from 'mongoose'
import { z } from 'zod'

const wholeQuantitySchema = z.string().regex(/^-?(?:0|[1-9]\d*)$/, 'Use a whole number')
const positiveWholeQuantitySchema = z.string().regex(/^[1-9]\d*$/, 'Use a whole number greater than zero')
const priceSchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/).refine((value) => Number(value) > 0)

export const inventoryProductsInputSchema = z.object({
  search: z.string().trim().max(80).default(''),
  activeOnly: z.boolean().default(false),
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
}).strict()
export type InventoryProductsInput = z.infer<typeof inventoryProductsInputSchema>

export const stockMovementsInputSchema = z.object({
  productId: z.instanceof(Types.ObjectId),
  first: z.number().int().min(1).max(100).default(20),
  after: z.string().trim().min(1).max(512).nullish(),
}).strict()
export type StockMovementsInput = z.infer<typeof stockMovementsInputSchema>

export const createInventoryProductInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  unit: z.string().trim().min(1).max(40),
  unitPrice: priceSchema,
  openingStock: wholeQuantitySchema,
  idempotencyKey: z.string().trim().min(8).max(100),
}).strict()
export type CreateInventoryProductInput = z.infer<typeof createInventoryProductInputSchema>

export const updateInventoryProductInputSchema = z.object({
  productId: z.instanceof(Types.ObjectId),
  expectedRevision: z.number().int().min(0),
  name: z.string().trim().min(1).max(80),
  unit: z.string().trim().min(1).max(40),
  unitPrice: priceSchema,
}).strict()
export type UpdateInventoryProductInput = z.infer<typeof updateInventoryProductInputSchema>

export const deactivateInventoryProductInputSchema = z.object({
  productId: z.instanceof(Types.ObjectId),
  expectedRevision: z.number().int().min(0),
}).strict()
export type DeactivateInventoryProductInput = z.infer<typeof deactivateInventoryProductInputSchema>

export const recordStockMovementInputSchema = z.object({
  productId: z.instanceof(Types.ObjectId),
  type: z.enum(['stock_in', 'stock_out']),
  quantity: positiveWholeQuantitySchema,
  reason: z.string().trim().min(3).max(240),
  idempotencyKey: z.string().trim().min(8).max(100),
}).strict()
export type RecordStockMovementInput = z.infer<typeof recordStockMovementInputSchema>

export const lubricantSaleInputSchema = z.object({
  id: z.string().trim().min(1).max(64),
  productId: z.instanceof(Types.ObjectId),
  quantity: positiveWholeQuantitySchema,
}).strict()
