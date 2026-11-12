import { describe, expect, it } from 'vitest'
import {
  parseTimesheetDateRange,
  timesheetListHref,
  userTimesheetHref,
} from './attendance-route'

describe('timesheet routes', () => {
  const range = { startDate: '2026-11-02', endDate: '2026-11-08' }

  it('parses a complete ordered date range', () => {
    expect(parseTimesheetDateRange(range)).toEqual(range)
  })

  it('rejects incomplete and reversed date ranges', () => {
    expect(parseTimesheetDateRange({ startDate: range.startDate })).toBeUndefined()
    expect(parseTimesheetDateRange({ startDate: range.endDate, endDate: range.startDate })).toBeUndefined()
  })

  it('preserves the range in list and user URLs', () => {
    expect(timesheetListHref(range)).toBe('/timesheet?startDate=2026-11-02&endDate=2026-11-08')
    expect(userTimesheetHref('507f1f77bcf86cd799439011', range)).toBe(
      '/timesheet/507f1f77bcf86cd799439011?startDate=2026-11-02&endDate=2026-11-08',
    )
  })
})
