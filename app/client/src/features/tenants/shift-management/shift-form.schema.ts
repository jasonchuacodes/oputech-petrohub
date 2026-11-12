import { z } from 'zod'

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use a valid time.')

export const addShiftFormSchema = z
  .object({
    name: z
      .string()
      .transform((value) => value.trim().replace(/\s+/g, ' '))
      .pipe(z.string().min(1, 'Shift name is required.').max(80, 'Use at most 80 characters.')),
    startTime: timeSchema,
    endTime: timeSchema,
  })
  .strict()
  .refine((shift) => shift.startTime !== shift.endTime, {
    message: 'End time must be different from start time.',
    path: ['endTime'],
  })

export type AddShiftFormValues = z.infer<typeof addShiftFormSchema>
