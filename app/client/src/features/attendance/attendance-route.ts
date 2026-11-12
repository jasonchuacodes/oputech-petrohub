import { z } from 'zod'

const localDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const timesheetUserParamsSchema = z.object({
  userId: z.string().regex(/^[a-f\d]{24}$/i),
})

const dateRangeSchema = z
  .object({
    startDate: localDateSchema,
    endDate: localDateSchema,
  })
  .refine(({ startDate, endDate }) => startDate <= endDate)

export type TimesheetDateRange = z.infer<typeof dateRangeSchema>

type SearchParams = Record<string, string | string[] | undefined>

export function parseTimesheetDateRange(searchParams: SearchParams): TimesheetDateRange | undefined {
  const result = dateRangeSchema.safeParse({
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
  })
  return result.success ? result.data : undefined
}

function withDateRange(path: string, range?: TimesheetDateRange): string {
  if (!range) return path
  const searchParams = new URLSearchParams(range)
  return `${path}?${searchParams.toString()}`
}

export function timesheetListHref(range?: TimesheetDateRange): string {
  return withDateRange('/timesheet', range)
}

export function userTimesheetHref(userId: string, range?: TimesheetDateRange): string {
  return withDateRange(`/timesheet/${userId}`, range)
}
