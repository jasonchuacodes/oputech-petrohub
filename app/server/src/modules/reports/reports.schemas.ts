import { Types } from 'mongoose'
import { z } from 'zod'

const businessDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const createReportInputSchema = z
  .object({
    shiftId: z.instanceof(Types.ObjectId),
    businessDate: businessDateSchema,
  })
  .strict()
export type CreateReportInput = z.infer<typeof createReportInputSchema>

export const reportInputSchema = z.object({ reportId: z.instanceof(Types.ObjectId) }).strict()
export type ReportInput = z.infer<typeof reportInputSchema>

export const reportsInputSchema = z
  .object({
    offset: z.number().int().min(0).default(0),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict()
export type ReportsInput = z.infer<typeof reportsInputSchema>

export const reportRevisionInputSchema = z
  .object({
    reportId: z.instanceof(Types.ObjectId),
    expectedRevision: z.number().int().min(0),
  })
  .strict()
export type ReportRevisionInput = z.infer<typeof reportRevisionInputSchema>
