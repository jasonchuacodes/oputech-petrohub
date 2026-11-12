import { describe, expect, it } from 'vitest'
import { currentReportMonth, previousReportBusinessDate } from './report-date-range'

describe('currentReportMonth', () => {
  it('uses the tenant-local month at a timezone boundary', () => {
    const instant = new Date('2026-03-31T16:30:00.000Z')

    expect(currentReportMonth('Asia/Manila', instant)).toEqual({
      startDate: '2026-04-01',
      endDate: '2026-04-30',
    })
    expect(currentReportMonth('America/New_York', instant)).toEqual({
      startDate: '2026-03-01',
      endDate: '2026-03-31',
    })
  })

  it('includes the last day of a leap-year February', () => {
    expect(currentReportMonth('UTC', new Date('2028-02-15T12:00:00.000Z'))).toEqual({
      startDate: '2028-02-01',
      endDate: '2028-02-29',
    })
  })
})

describe('previousReportBusinessDate', () => {
  it('uses the tenant-local calendar date at a timezone boundary', () => {
    const instant = new Date('2026-04-01T00:30:00.000Z')

    expect(previousReportBusinessDate('Asia/Manila', instant)).toBe('2026-03-31')
    expect(previousReportBusinessDate('America/New_York', instant)).toBe('2026-03-30')
  })

  it('handles month, year, and leap-day boundaries', () => {
    expect(previousReportBusinessDate('UTC', new Date('2026-01-01T12:00:00.000Z'))).toBe('2025-12-31')
    expect(previousReportBusinessDate('UTC', new Date('2028-03-01T12:00:00.000Z'))).toBe('2028-02-29')
  })
})
