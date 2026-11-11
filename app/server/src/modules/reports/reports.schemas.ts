import { Types } from 'mongoose'
import { z } from 'zod'
import { editableDisposalInputSchema } from '../disposals/disposals.schemas'

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

const moneySchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/).refine((value) => Number(value) > 0)
const financialEntrySchema = z.object({
  id: z.string().trim().min(1).max(64),
  description: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(240).nullable(),
  amount: moneySchema,
}).strict()

export const saveReportDraftInputSchema = z.object({
  reportId: z.instanceof(Types.ObjectId),
  expectedReportRevision: z.number().int().min(0),
  expectedDisposalRevision: z.number().int().min(0),
  incomeEntries: z.array(financialEntrySchema).max(100),
  expenseEntries: z.array(financialEntrySchema).max(100),
  disposalReadings: z.array(editableDisposalInputSchema).max(100),
}).strict()
export type SaveReportDraftInput = z.infer<typeof saveReportDraftInputSchema>

export const reportTransitionInputSchema = z.object({
  reportId: z.instanceof(Types.ObjectId),
  expectedReportRevision: z.number().int().min(0),
  expectedDisposalRevision: z.number().int().min(0),
}).strict()
export type ReportTransitionInput = z.infer<typeof reportTransitionInputSchema>

export const deleteReportInputSchema = reportTransitionInputSchema.extend({
  reason: z.string().trim().min(3).max(240),
}).strict()
export type DeleteReportInput = z.infer<typeof deleteReportInputSchema>
