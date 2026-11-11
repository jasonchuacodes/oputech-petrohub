import { z } from 'zod'
export const reportDetailParamsSchema = z.object({
  reportId: z.string().regex(/^[a-f\d]{24}$/i),
})

const moneyInputSchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/, 'Use up to 2 decimal places')
const meterInputSchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,3})?$/, 'Use up to 3 decimal places')

const reportEntryBaseSchema = z.object({
  id: z.string().min(1),
  recurringIncomeFieldId: z.string().nullable(),
  description: z.string().trim().min(1, 'Description is required').max(120),
  notes: z.string().max(240),
})

export const reportEntrySchema = reportEntryBaseSchema.extend({
  amount: moneyInputSchema.refine((value) => Number(value) > 0, 'Amount must be greater than zero'),
})

export const reportIncomeEntrySchema = reportEntryBaseSchema.extend({
  amount: z.union([z.literal(''), moneyInputSchema]),
}).superRefine((entry, context) => {
  if (!entry.recurringIncomeFieldId && (!entry.amount || Number(entry.amount) <= 0)) {
    context.addIssue({ code: 'custom', message: 'Amount must be greater than zero', path: ['amount'] })
  }
})

export const disposalReadingSchema = z.object({
  meterId: z.string().min(1),
  closingReading: z.union([z.literal(''), meterInputSchema]),
  calibration: meterInputSchema,
})

export const reportDetailFormSchema = z.object({
  incomeEntries: z.array(reportIncomeEntrySchema).max(100),
  expenseEntries: z.array(reportEntrySchema).max(100),
  disposalReadings: z.array(disposalReadingSchema).max(100),
})

export type ReportDetailFormValues = z.infer<typeof reportDetailFormSchema>
