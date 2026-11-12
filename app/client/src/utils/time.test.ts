import { describe, expect, it } from 'vitest'
import { formatShiftTime, formatTime12Hour } from './time'

describe('shift time formatting', () => {
  it.each([
    ['00:00', '12:00AM'],
    ['06:05', '6:05AM'],
    ['12:00', '12:00PM'],
    ['14:30', '2:30PM'],
    ['23:59', '11:59PM'],
  ])('formats %s in 12-hour time', (value, expected) => {
    expect(formatTime12Hour(value)).toBe(expected)
  })

  it('formats overnight shifts', () => {
    expect(formatShiftTime({ startTime: '22:00', endTime: '06:00' })).toBe(
      '10:00PM–6:00AM',
    )
  })
})
