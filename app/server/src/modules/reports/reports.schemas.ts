import { Types } from 'mongoose'
import { z } from 'zod'
import { editableDisposalInputSchema } from '../disposals/disposals.schemas'
import { lubricantSaleInputSchema } from '../inventory/inventory.schemas'

const businessDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const [year, month, day] = value.split('-').map(Number) as [number, number, number]
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}, 'Use a valid date.')

export const createReportInputSchema = z
  .object({
    slotId: z.string().trim().min(1).max(160),
    businessDate: businessDateSchema,
  })
  .strict()
export type CreateReportInput = z.infer<typeof createReportInputSchema>

export const reportInputSchema = z.object({ reportId: z.instanceof(Types.ObjectId) }).strict()
export type ReportInput = z.infer<typeof reportInputSchema>

export const reportsInputSchema = z
  .object({
    startDate: businessDateSchema.nullish(),
    endDate: businessDateSchema.nullish(),
    submittedOnly: z.boolean().default(false),
    offset: z.number().int().min(0).default(0),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict()
  .refine((input) => Boolean(input.startDate) === Boolean(input.endDate), {
    message: 'Provide both start and end dates.',
  })
  .refine((input) => !input.startDate || !input.endDate || input.startDate <= input.endDate, {
    message: 'Start date must be on or before end date.',
  })
export type ReportsInput = z.infer<typeof reportsInputSchema>

export const financialSummaryInputSchema = z
  .object({
    startDate: businessDateSchema,
    endDate: businessDateSchema,
  })
  .strict()
  .refine((input) => input.startDate <= input.endDate, {
    message: 'Start date must be on or before end date.',
  })
  .refine((input) => inclusiveDayCount(input.startDate, input.endDate) <= 3660, {
    message: 'Date range cannot exceed 3660 days.',
  })
export type FinancialSummaryInput = z.infer<typeof financialSummaryInputSchema>

const nonnegativeMoneySchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/)
const positiveMoneySchema = nonnegativeMoneySchema.refine((value) => !/^0(?:\.0{1,2})?$/.test(value))
const financialEntrySchema = z.object({
  id: z.string().trim().min(1).max(64),
  description: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(240).nullable(),
}).strict()

const incomeEntrySchema = financialEntrySchema.extend({ amount: nonnegativeMoneySchema })
const expenseEntrySchema = financialEntrySchema.extend({ amount: positiveMoneySchema })

export const saveReportDraftInputSchema = z.object({
  reportId: z.instanceof(Types.ObjectId),
  expectedReportRevision: z.number().int().min(0),
  expectedDisposalRevision: z.number().int().min(0),
  incomeEntries: z.array(incomeEntrySchema).max(100),
  expenseEntries: z.array(expenseEntrySchema).max(100),
  lubricantSales: z.array(lubricantSaleInputSchema).max(100).optional(),
  disposalReadings: z.array(editableDisposalInputSchema).max(100),
}).strict()
export type SaveReportDraftInput = z.infer<typeof saveReportDraftInputSchema>

export const updateReportRemarksInputSchema = z.object({
  reportId: z.instanceof(Types.ObjectId),
  expectedRevision: z.number().int().min(0),
  remarks: z.string().trim().max(1000),
}).strict()
export type UpdateReportRemarksInput = z.infer<typeof updateReportRemarksInputSchema>

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

function inclusiveDayCount(startDate: string, endDate: string): number {
  const [startYear, startMonth, startDay] = startDate.split('-').map(Number) as [number, number, number]
  const [endYear, endMonth, endDay] = endDate.split('-').map(Number) as [number, number, number]
  return Math.floor(
    (Date.UTC(endYear, endMonth - 1, endDay) - Date.UTC(startYear, startMonth - 1, startDay)) /
    86_400_000,
  ) + 1
}
