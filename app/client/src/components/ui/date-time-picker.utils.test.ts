import { describe, expect, it } from 'vitest'
import { parseHourOnlyTime, toHourOnlyTime, type TimePeriod } from './date-time-picker.utils'

describe('hour-only time conversion', () => {
  it.each([
    ['00:00', 12, 'AM'],
    ['01:00', 1, 'AM'],
    ['11:00', 11, 'AM'],
    ['12:00', 12, 'PM'],
    ['13:00', 1, 'PM'],
    ['23:00', 11, 'PM'],
  ] as const)('parses %s as %s %s', (time, hour, period) => {
    expect(parseHourOnlyTime(time)).toEqual({ hour, period })
  })

  it('normalizes existing minutes to hour-only precision', () => {
    expect(parseHourOnlyTime('10:37')).toEqual({ hour: 10, period: 'AM' })
    expect(toHourOnlyTime(10, 'AM')).toBe('10:00')
  })

  it('round-trips every hour of the day', () => {
    for (let hour24 = 0; hour24 < 24; hour24 += 1) {
      const time = `${String(hour24).padStart(2, '0')}:00`
      const parsed = parseHourOnlyTime(time)

      expect(parsed).not.toBeNull()
      expect(toHourOnlyTime(parsed!.hour, parsed!.period)).toBe(time)
    }
  })

  it.each([
    [null, 'AM'],
    [1, null],
    [0, 'AM'],
    [13, 'PM'],
  ] as const)('returns an empty value for incomplete or invalid input', (hour, period) => {
    expect(toHourOnlyTime(hour, period as TimePeriod | null)).toBe('')
  })

  it.each(['', 'noon', '24:00', '-1:00'])('rejects invalid input %j', (time) => {
    expect(parseHourOnlyTime(time)).toBeNull()
  })
})
