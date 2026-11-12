import { describe, expect, it } from 'vitest'
import { formatDuration, formatHours, formatTimesheetTime } from './attendance.utils'

describe('attendance formatting', () => {
  it('formats cumulative durations without wrapping after 24 hours', () => {
    expect(formatDuration(3 * 3600 + 2 * 60 + 1)).toBe('03:02:01')
    expect(formatDuration(27 * 3600)).toBe('27:00:00')
  })

  it('formats hour totals to two decimal places', () => {
    expect(formatHours('8')).toBe('8.00')
    expect(formatHours('10.5')).toBe('10.50')
  })

  it('formats attendance instants in the tenant timezone', () => {
    expect(formatTimesheetTime('2026-12-12T01:30:00.000Z', 'Asia/Manila')).toBe('9:30AM')
    expect(formatTimesheetTime(null, 'Asia/Manila')).toBe('-')
  })
})
