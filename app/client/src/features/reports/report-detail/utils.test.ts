import { describe, expect, it } from 'vitest'
import type { ReportDetailRecord } from '../reports.queries'
import { calculatePreview, formatDisposalVolume } from './utils'

const report = {
  incomeEntries: [],
  expenseEntries: [],
  lubricantSales: [],
  disposals: {
    readings: [{ openingReading: '100.000', unitPrice: '10.00' }],
  },
} as unknown as ReportDetailRecord

describe('disposal preview', () => {
  it('deducts calibration from the reading difference', () => {
    const preview = calculatePreview(report, {
      disposalReadings: [{ closingReading: '110.000', calibration: '2.000' }],
    })

    expect(preview.readings).toEqual([{ net: '8.000', sales: '80.00' }])
    expect(preview.complete).toBe(true)
  })

  it('keeps a zero net disposal complete', () => {
    const preview = calculatePreview(report, {
      disposalReadings: [{ closingReading: '110.000', calibration: '10.000' }],
    })

    expect(preview.readings[0]?.net).toBe('0.000')
    expect(preview.complete).toBe(true)
  })

  it.each([
    { closingReading: '', calibration: '0' },
    { closingReading: '99', calibration: '0' },
    { closingReading: '110', calibration: '11' },
    { closingReading: '110', calibration: '-1' },
    { closingReading: 'Infinity', calibration: '0' },
  ])('marks invalid disposal values unavailable', (reading) => {
    const preview = calculatePreview(report, { disposalReadings: [reading] })

    expect(preview.readings).toEqual([{}])
    expect(preview.complete).toBe(false)
  })

  it('formats net volume in liters', () => {
    expect(formatDisposalVolume('30')).toBe('30.000 L')
    expect(formatDisposalVolume('0')).toBe('0.000 L')
    expect(formatDisposalVolume(undefined)).toBe('—')
  })
})
