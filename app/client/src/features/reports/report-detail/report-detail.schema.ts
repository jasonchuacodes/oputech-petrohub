import { z } from 'zod'
export const reportDetailParamsSchema = z.object({
  reportId: z.string().regex(/^[a-f\d]{24}$/i),
})

const moneyInputSchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/, 'Use up to 2 decimal places')
const meterInputSchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,3})?$/, 'Use up to 3 decimal places')

export const reportEntrySchema = z.object({
  id: z.string().min(1),
  description: z.string().trim().min(1, 'Description is required').max(120),
  notes: z.string().max(240),
  amount: moneyInputSchema.refine((value) => Number(value) > 0, 'Amount must be greater than zero'),
})

export const reportDetailFormSchema = z.object({
  incomeEntries: z.array(reportEntrySchema).max(100),
  expenseEntries: z.array(reportEntrySchema).max(100),
  disposalReadings: z.array(z.object({
    meterId: z.string().min(1),
    closingReading: z.union([z.literal(''), meterInputSchema]),
    calibration: meterInputSchema,
  })).max(100),
})

export type ReportDetailFormValues = z.infer<typeof reportDetailFormSchema>
