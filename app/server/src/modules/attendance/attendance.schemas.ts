import { Types } from 'mongoose'
import { z } from 'zod'

const localDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const overrideHoursSchema = z
  .string()
  .trim()
  .max(20)
  .regex(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/)

export const checkInAttendanceInputSchema = z
  .object({ idempotencyKey: z.string().uuid() })
  .strict()
export type CheckInAttendanceInput = z.infer<typeof checkInAttendanceInputSchema>

export const checkOutAttendanceInputSchema = z
  .object({ sessionId: z.instanceof(Types.ObjectId) })
  .strict()
export type CheckOutAttendanceInput = z.infer<typeof checkOutAttendanceInputSchema>

export const timesheetsFilterSchema = z
  .object({
    startDate: localDateSchema.nullish(),
    endDate: localDateSchema.nullish(),
    userId: z.instanceof(Types.ObjectId).nullish(),
    offset: z.number().int().min(0).default(0),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict()
  .refine((input) => Boolean(input.startDate) === Boolean(input.endDate), {
    message: 'Provide both start and end dates.',
  })
export type TimesheetsFilter = z.infer<typeof timesheetsFilterSchema>

export const timesheetDaysFilterSchema = z
  .object({
    userId: z.instanceof(Types.ObjectId),
    startDate: localDateSchema,
    endDate: localDateSchema,
  })
  .strict()
export type TimesheetDaysFilter = z.infer<typeof timesheetDaysFilterSchema>

export const setTimesheetDayOverrideInputSchema = z
  .object({
    userId: z.instanceof(Types.ObjectId),
    localDate: localDateSchema,
    overrideHours: overrideHoursSchema.nullable(),
    expectedRevision: z.number().int().min(0),
  })
  .strict()
export type SetTimesheetDayOverrideInput = z.infer<typeof setTimesheetDayOverrideInputSchema>
