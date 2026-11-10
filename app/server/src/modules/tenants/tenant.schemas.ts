import { z } from 'zod'
import { Types } from 'mongoose'

export const createTenantInputSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
  })
  .strict()

export type CreateTenantInput = z.infer<typeof createTenantInputSchema>

export const updateTenantInputSchema = z
  .object({
    tenantId: z.instanceof(Types.ObjectId),
    name: z.string().trim().min(1).max(80),
  })
  .strict()

export type UpdateTenantInput = z.infer<typeof updateTenantInputSchema>

export const deleteTenantInputSchema = z
  .object({
    tenantId: z.instanceof(Types.ObjectId),
  })
  .strict()

export type DeleteTenantInput = z.infer<typeof deleteTenantInputSchema>
