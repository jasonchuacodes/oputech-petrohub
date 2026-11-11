import { InvalidInputException } from '../../common/exceptions'

const localDatePattern = /^\d{4}-\d{2}-\d{2}$/

export function assertLocalDate(value: string): string {
  if (!localDatePattern.test(value)) throw new InvalidInputException('Use a valid date.')
  const [year, month, day] = parseDate(value)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new InvalidInputException('Use a valid date.')
  }
  return value
}

export function localDateFor(timezone: string, instant = new Date()): string {
  const values = zonedParts(timezone, instant)
  return formatDate(values.year, values.month, values.day)
}

export function startOfLocalDate(localDate: string, timezone: string): Date {
  assertLocalDate(localDate)
  const [year, month, day] = parseDate(localDate)
  const desired = Date.UTC(year, month - 1, day)
  let candidate = desired

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const current = zonedParts(timezone, new Date(candidate))
    const represented = Date.UTC(
      current.year,
      current.month - 1,
      current.day,
      current.hour,
      current.minute,
      current.second,
    )
    const correction = desired - represented
    candidate += correction
    if (correction === 0) break
  }

  return new Date(candidate)
}

export function addLocalDays(localDate: string, amount: number): string {
  assertLocalDate(localDate)
  const [year, month, day] = parseDate(localDate)
  const date = new Date(Date.UTC(year, month - 1, day + amount))
  return formatDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate())
}

export function datesBetween(startDate: string, endDate: string): string[] {
  assertLocalDate(startDate)
  assertLocalDate(endDate)
  if (startDate > endDate) throw new InvalidInputException('Start date must be on or before end date.')

  const dates: string[] = []
  for (let date = startDate; date <= endDate; date = addLocalDays(date, 1)) {
    dates.push(date)
    if (dates.length > 366) throw new InvalidInputException('Date range cannot exceed 366 days.')
  }
  return dates
}

export function currentWeek(timezone: string, instant = new Date()) {
  const today = localDateFor(timezone, instant)
  const [year, month, day] = parseDate(today)
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  const startDate = addLocalDays(today, -weekday)
  return { startDate, endDate: addLocalDays(startDate, 6) }
}

function zonedParts(timezone: string, instant: Date) {
  let parts: Intl.DateTimeFormatPart[]
  try {
    parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(instant)
  } catch {
    throw new InvalidInputException('Tenant timezone is invalid.')
  }
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  }
}

function formatDate(year: number, month: number, day: number) {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function parseDate(value: string): [number, number, number] {
  const parts = value.split('-')
  return [Number(parts[0]), Number(parts[1]), Number(parts[2])]
}
