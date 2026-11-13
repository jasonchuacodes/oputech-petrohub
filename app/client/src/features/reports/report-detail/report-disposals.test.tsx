import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import type { ReportDetailRecord } from '../reports.queries'
import { ReportDisposalsPanel } from './report-disposals'

const mocks = vi.hoisted(() => ({
  editor: undefined as unknown,
  formReadings: [
    { closingReading: '110.000', calibration: '2.000' },
    { closingReading: '140.000', calibration: '0.000' },
  ],
}))

vi.mock('react-hook-form', () => ({
  useWatch: () => mocks.formReadings,
}))

vi.mock('./report-editor-context', () => ({
  useReportEditor: () => mocks.editor,
}))

const readings = [
  {
    meterId: 'meter-1',
    meterLabel: 'ADO 1',
    productId: 'ado',
    productName: 'ADO',
    unitPrice: '10.00',
    openingReading: '100.000',
    calibration: '2.000',
  },
  {
    meterId: 'meter-2',
    meterLabel: 'ADO 2',
    productId: 'ado',
    productName: 'ADO',
    unitPrice: '10.00',
    openingReading: '118.000',
    calibration: '0.000',
  },
] as unknown as NonNullable<ReportDetailRecord['disposals']>['readings']

describe('ReportDisposalsPanel', () => {
  it('shows the product summary above reordered meter metrics', () => {
    mocks.editor = {
      report: { disposals: { readings } },
      form: { control: {}, formState: { errors: {} } },
      preview: {
        readings: [
          { net: '8.000', sales: '80.00' },
          { net: '22.000', sales: '220.00' },
        ],
      },
    }

    const html = renderToStaticMarkup(<ReportDisposalsPanel />)

    expect(html).toContain('Disposal summary')
    expect(html).toContain('30.000 L')
    expect(html.indexOf('Disposal summary')).toBeLessThan(html.indexOf('ADO 1'))
    expect(html).not.toContain('Current reading')
    expect(html).not.toContain('Previous reading')

    const labels = [
      'After reading',
      'Before reading',
      'Calibration',
      '>Disposal<',
      'Price',
      'Computed sales',
    ]
    labels.reduce((previousIndex, label) => {
      const index = html.indexOf(label, previousIndex + 1)
      expect(index).toBeGreaterThan(previousIndex)
      return index
    }, -1)
  })
})
