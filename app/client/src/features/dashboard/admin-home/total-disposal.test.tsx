import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { FinancialSummaryQuery } from '~/generated/graphql'
import { TotalDisposal } from './total-disposal'

type DisposalTotal = FinancialSummaryQuery['financialSummary']['disposalTotals'][number]

describe('TotalDisposal', () => {
  it('renders text-only product cards with formatted liters', () => {
    const totals: DisposalTotal[] = [
      { productId: 'ado', productName: 'ADO', productColor: 'green', netVolume: '30' },
      { productId: 'xtr', productName: 'XTR', productColor: 'orange', netVolume: '0' },
    ]

    const html = renderToStaticMarkup(<TotalDisposal totals={totals} />)

    expect(html).toContain('Total disposal')
    expect(html).toContain('ADO')
    expect(html).toContain('30.000 L')
    expect(html).toContain('XTR')
    expect(html).toContain('0.000 L')
    expect(html).toContain('text-fuel-green')
    expect(html).toContain('text-fuel-orange')
    expect(html).not.toContain('<button')
  })

  it('marks incomplete product totals as unavailable', () => {
    const totals: DisposalTotal[] = [
      { productId: 'ado', productName: 'ADO', productColor: 'gray', netVolume: null },
    ]

    const html = renderToStaticMarkup(<TotalDisposal totals={totals} />)

    expect(html).toContain('submitted disposal data is incomplete')
    expect(html).toContain('—')
  })
})
