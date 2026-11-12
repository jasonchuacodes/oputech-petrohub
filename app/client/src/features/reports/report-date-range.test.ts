import { describe, expect, it } from 'vitest'
import { currentReportMonth } from './report-date-range'

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
