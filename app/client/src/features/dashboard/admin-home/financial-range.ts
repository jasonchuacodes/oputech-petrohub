import { z } from 'zod'

export type FinancialPeriod = 'weekly' | 'monthly' | 'custom'

export type FinancialRange = {
  period: FinancialPeriod
  startDate: string
  endDate: string
}

const financialPeriodSchema = z.enum(['weekly', 'monthly', 'custom'])
const localDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const [year, month, day] = parseDate(value)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
})

export function financialRangeFromParams(
  params: Pick<URLSearchParams, 'get'>,
  timezone: string,
  now = new Date(),
): FinancialRange {
  const today = localDateFor(timezone, now)
  const period = financialPeriodSchema.safeParse(params.get('financePeriod')).data ?? 'monthly'

  if (period === 'weekly') return currentFinancialRange('weekly', timezone, now)
  if (period === 'custom') {
    const parsedStart = localDateSchema.safeParse(params.get('financeStart'))
    const parsedEnd = localDateSchema.safeParse(params.get('financeEnd'))
    if (
      parsedStart.success &&
      parsedEnd.success &&
      parsedStart.data <= parsedEnd.data &&
      parsedEnd.data <= today
    ) {
      return { period, startDate: parsedStart.data, endDate: parsedEnd.data }
    }
  }

  return currentFinancialRange('monthly', timezone, now)
}

export function currentFinancialRange(
  period: Exclude<FinancialPeriod, 'custom'>,
  timezone: string,
  now = new Date(),
): FinancialRange {
  const today = localDateFor(timezone, now)
  if (period === 'monthly') {
    const [year, month] = parseDate(today)
    const monthEnd = new Date(Date.UTC(year, month, 0))
    return {
      period,
      startDate: formatDate(year, month, 1),
      endDate: formatDate(monthEnd.getUTCFullYear(), monthEnd.getUTCMonth() + 1, monthEnd.getUTCDate()),
    }
  }

  const weekday = new Date(`${today}T00:00:00Z`).getUTCDay()
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday
  const startDate = addDays(today, mondayOffset)
  return { period, startDate, endDate: addDays(startDate, 5) }
}

export function localDateFor(timezone: string, now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function addDays(date: string, amount: number): string {
  const [year, month, day] = parseDate(date)
  const next = new Date(Date.UTC(year, month - 1, day + amount))
  return formatDate(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate())
}

function parseDate(date: string): [number, number, number] {
  return date.split('-').map(Number) as [number, number, number]
}

function formatDate(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
