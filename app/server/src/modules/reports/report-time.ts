import { InvalidInputException } from '../../common/exceptions'
import { Shift } from '../tenants/schemas/shift.schema'

type ZonedParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

export type ReportInterval = {
  startAt: Date
  endAt: Date
  startTime: string
  endTime: string
  timezone: string
}

export function localHourToInstant(localDate: string, hour: number, timezone: string): Date {
  return localDateTimeToInstant(localDate, `${String(hour).padStart(2, '0')}:00`, timezone)
}

export function shiftInterval(businessDate: string, shift: Shift, timezone: string): ReportInterval {
  const endDate = shift.endTime <= shift.startTime ? addLocalDays(businessDate, 1) : businessDate
  return {
    startAt: localDateTimeToInstant(businessDate, shift.startTime, timezone),
    endAt: localDateTimeToInstant(endDate, shift.endTime, timezone),
    startTime: shift.startTime,
    endTime: shift.endTime,
    timezone,
  }
}

export function displayTime(timezone: string, instant: Date): string {
  const parts = zonedParts(timezone, instant)
  return `${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}`
}

function localDateTimeToInstant(localDate: string, localTime: string, timezone: string): Date {
  const [year, month, day] = localDate.split('-').map(Number) as [number, number, number]
  const [hour, minute] = localTime.split(':').map(Number) as [number, number]
  const desired = Date.UTC(year, month - 1, day, hour, minute)
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

  const instant = new Date(candidate)
  const represented = zonedParts(timezone, instant)
  if (
    represented.year !== year ||
    represented.month !== month ||
    represented.day !== day ||
    represented.hour !== hour ||
    represented.minute !== minute
  ) {
    throw new InvalidInputException('The selected local time is not valid in the tenant timezone.')
  }
  return instant
}

function zonedParts(timezone: string, instant: Date): ZonedParts {
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

function addLocalDays(localDate: string, amount: number): string {
  const [year, month, day] = localDate.split('-').map(Number) as [number, number, number]
  const date = new Date(Date.UTC(year, month - 1, day + amount))
  return `${String(date.getUTCFullYear()).padStart(4, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
}
