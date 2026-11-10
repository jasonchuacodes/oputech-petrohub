import { z } from 'zod'

export const createTenantInputSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
  })
  .strict()

export type CreateTenantInput = z.infer<typeof createTenantInputSchema>
