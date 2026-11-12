import { describe, expect, it } from 'vitest'
import { currentFinancialRange, financialRangeFromParams } from './financial-range'

describe('financial dashboard ranges', () => {
  it('uses the current calendar month by default', () => {
    expect(currentFinancialRange('monthly', 'Asia/Manila', new Date('2026-11-12T04:00:00Z'))).toEqual({
      period: 'monthly',
      startDate: '2026-11-01',
      endDate: '2026-11-30',
    })
  })

  it('uses Monday through Saturday for the weekly period', () => {
    expect(currentFinancialRange('weekly', 'Asia/Manila', new Date('2026-11-12T04:00:00Z'))).toEqual({
      period: 'weekly',
      startDate: '2026-11-09',
      endDate: '2026-11-14',
    })
  })

  it('shows the previous Monday through Saturday on Sunday', () => {
    expect(currentFinancialRange('weekly', 'Asia/Manila', new Date('2026-11-15T04:00:00Z'))).toEqual({
      period: 'weekly',
      startDate: '2026-11-09',
      endDate: '2026-11-14',
    })
  })

  it('accepts a valid custom range and falls back from future dates', () => {
    const valid = new URLSearchParams('financePeriod=custom&financeStart=2026-10-01&financeEnd=2026-10-10')
    expect(financialRangeFromParams(valid, 'Asia/Manila', new Date('2026-11-12T04:00:00Z'))).toEqual({
      period: 'custom',
      startDate: '2026-10-01',
      endDate: '2026-10-10',
    })

    const future = new URLSearchParams('financePeriod=custom&financeStart=2026-12-01&financeEnd=2026-12-10')
    expect(financialRangeFromParams(future, 'Asia/Manila', new Date('2026-11-12T04:00:00Z')).period).toBe('monthly')
  })
})
