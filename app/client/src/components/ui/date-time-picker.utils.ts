export type TimePeriod = 'AM' | 'PM'

export function parseHourOnlyTime(time: string): { hour: number; period: TimePeriod } | null {
  const match = /^(\d{1,2}):\d{2}$/.exec(time)
  if (!match) return null

  const hour24 = Number(match[1])
  if (!Number.isInteger(hour24) || hour24 < 0 || hour24 > 23) return null

  return {
    hour: hour24 % 12 || 12,
    period: hour24 >= 12 ? 'PM' : 'AM',
  }
}

export function toHourOnlyTime(hour: number | null, period: TimePeriod | null): string {
  if (hour === null || period === null || !Number.isInteger(hour) || hour < 1 || hour > 12) {
    return ''
  }

  const hour24 = (hour % 12) + (period === 'PM' ? 12 : 0)
  return `${String(hour24).padStart(2, '0')}:00`
}
