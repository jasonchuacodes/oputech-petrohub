import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { ReportsQuery } from '~/generated/graphql'
import { SubmittedReports } from './submitted-reports'

const query = vi.hoisted(() => ({ result: undefined as unknown }))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: ReactNode; href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('../../reports/reports.queries', () => ({
  useReportsQuery: () => query.result,
}))

const report = {
  id: 'report-1',
  creatorName: 'Pat Manager',
  submittedByName: 'Pat Manager',
  interval: {
    startTime: '05:00',
    endTime: '13:00',
    timezone: 'Asia/Manila',
    startAt: '2026-11-13T21:00:00.000Z',
    endAt: '2026-11-14T05:00:00.000Z',
  },
  totals: {
    income: '100',
    expenses: '20',
    cashFuelSales: '120',
    pumpSales: '300',
    overShort: '-180',
    lubricantSales: '0',
  },
  disposals: {
    readings: [
      { productId: 'ado', productName: 'ADO', netVolume: '8.000' },
      { productId: 'ado', productName: 'ADO', netVolume: '22.000' },
      { productId: 'xtr', productName: 'XTR', netVolume: '5.500' },
    ],
  },
} as unknown as ReportsQuery['reports']['items'][number]

describe('SubmittedReports', () => {
  it('separates and collates disposal totals on each report card', () => {
    query.result = {
      isPending: false,
      isError: false,
      isRefetchError: false,
      data: { items: [report], totalCount: 1 },
      refetch: vi.fn(),
    }

    const html = renderToStaticMarkup(
      <SubmittedReports tenantId="tenant-1" timezone="Asia/Manila" />,
    )

    expect(html).toContain('Cash fuel sales')
    expect(html).toContain('Disposals')
    expect(html).toContain('ADO')
    expect(html).toContain('30.000 L')
    expect(html).toContain('XTR')
    expect(html).toContain('5.500 L')
    expect(html.indexOf('Disposals')).toBeGreaterThan(html.indexOf('Cash fuel sales'))
    expect(html).toContain('href="/report/report-1"')
  })
})
