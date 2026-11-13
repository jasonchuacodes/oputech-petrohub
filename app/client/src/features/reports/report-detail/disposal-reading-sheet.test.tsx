import { renderToStaticMarkup } from 'react-dom/server'
import { createRef, type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { ReportDetailRecord } from '../reports.queries'
import { DisposalReadingSheet } from './disposal-reading-sheet'

const mocks = vi.hoisted(() => ({ editor: undefined as unknown }))

vi.mock('~/components/ui/sheet', () => ({
  Sheet: ({ title, description, children }: {
    title: string
    description?: string
    children: ReactNode
  }) => (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </section>
  ),
}))

vi.mock('./report-editor-context', () => ({
  useReportEditor: () => mocks.editor,
}))

const reading = {
  meterId: 'meter-1',
  meterLabel: 'ADO 1',
  productId: 'ado',
  productName: 'ADO',
  unitPrice: '10.00',
  openingReading: '100.000',
  calibration: '2.000',
} as unknown as NonNullable<ReportDetailRecord['disposals']>['readings'][number]

describe('DisposalReadingSheet', () => {
  it('matches the disposal card metric order', () => {
    const values = [{ meterId: 'meter-1', closingReading: '110.000', calibration: '2.000' }]
    mocks.editor = {
      report: {
        incomeEntries: [],
        expenseEntries: [],
        lubricantSales: [],
        disposals: { readings: [reading] },
      },
      form: {
        getValues: (path: string) => path.endsWith('closingReading') ? '110.000' : '2.000',
        watch: () => values,
        setValue: vi.fn(),
      },
      canEdit: true,
      submitReportPending: false,
      deleteReportPending: false,
      actionError: undefined,
      save: vi.fn(),
    }

    const html = renderToStaticMarkup(
      <DisposalReadingSheet
        reading={reading}
        index={0}
        onClose={vi.fn()}
        returnFocusRef={createRef<HTMLElement>()}
      />,
    )

    expect(html).toContain('ADO 1 · ADO')
    expect(html).toContain('8.000 L')
    expect(html).toContain('₱80.00')

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
