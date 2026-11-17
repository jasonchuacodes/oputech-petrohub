import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { FuelProductFieldsFragment } from '~/generated/graphql'
import { FuelProductSheet } from './fuel-product-sheet'

const mutation = { isPending: false, mutateAsync: vi.fn() }

vi.mock('../fuel-setup.queries', () => ({
  useCancelFuelPriceChangeMutation: () => mutation,
  useChangeFuelPriceMutation: () => mutation,
  useCreateFuelProductMutation: () => mutation,
  useUpdateFuelProductMutation: () => mutation,
}))

vi.mock('./setup-sheet', () => ({
  SetupSheet: ({ title, children }: { title: string; children: ReactNode }) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}))

const product: FuelProductFieldsFragment = {
  id: 'product-1',
  name: 'ADO',
  color: 'orange',
  unitPrice: '60.00',
  status: 'active',
  revision: 3,
  nextPriceChange: {
    unitPrice: '61.50',
    effectiveDate: '2099-01-02',
    effectiveHour: 9,
    effectiveAt: '2099-01-02T01:00:00.000Z',
  },
}

describe('FuelProductSheet', () => {
  it('allows a future price change while editing the fuel product', () => {
    const html = renderToStaticMarkup(
      <FuelProductSheet tenantId="tenant-1" product={product} timezone="Asia/Manila" onClose={vi.fn()} />,
    )

    expect(html).toContain('Edit fuel product')
    expect(html).toContain('Scheduled price change')
    expect(html).toContain('aria-label="Cancel saved scheduled price change"')
    expect(html).toContain('type="checkbox"')
    expect(html).toContain('Product color')
    expect(html).toContain('value="orange"')
    expect(html).toContain('value="gray"')
    expect(html).toContain('value="yellow"')
  })

  it('keeps a cancellation action on a saved scheduled price change', () => {
    const html = renderToStaticMarkup(
      <FuelProductSheet tenantId="tenant-1" product={product} mode="price" timezone="Asia/Manila" onClose={vi.fn()} />,
    )

    expect(html).toContain('Scheduled price change')
    expect(html).toContain('₱61.50')
    expect(html).toContain('aria-label="Cancel saved scheduled price change"')
    expect(html).toContain('text-fuel-orange')
    expect(html).not.toContain('Product color')
  })

  it('does not show the saved cancellation action without a scheduled change', () => {
    const html = renderToStaticMarkup(
      <FuelProductSheet
        tenantId="tenant-1"
        product={{ ...product, nextPriceChange: null }}
        mode="price"
        timezone="Asia/Manila"
        onClose={vi.fn()}
      />,
    )

    expect(html).not.toContain('aria-label="Cancel saved scheduled price change"')
  })
})
