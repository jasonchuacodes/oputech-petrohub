import { z } from 'zod'
export const reportDetailParamsSchema = z.object({
  reportId: z.string().regex(/^[a-f\d]{24}$/i),
})
