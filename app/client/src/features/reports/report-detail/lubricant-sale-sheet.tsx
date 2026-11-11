'use client'

import Decimal from 'decimal.js'
import { ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Sheet } from '~/components/ui/sheet'
import { Spinner } from '~/components/ui/spinner'
import type { InventoryProductFieldsFragment } from '~/generated/graphql'
import { cn } from '~/utils/cn'
import { useInventoryProductsQuery } from '../../inventory/inventory.queries'
import { useReportEditor } from './report-editor-context'
import { formatMoney } from './utils'

export function LubricantSaleSheet() {
  const { tenantId, form, lubricants, lubricantSaleIndex, closeLubricantSale } = useReportEditor()
  const current = lubricantSaleIndex === undefined
    ? undefined
    : form.getValues(`lubricantSales.${lubricantSaleIndex}`)
  const [selected, setSelected] = useState<InventoryProductFieldsFragment | undefined>(
    current ? currentProduct(current) : undefined,
  )
  const [quantity, setQuantity] = useState(current?.quantity ?? '1')
  const [selectingProduct, setSelectingProduct] = useState(false)
  const validQuantity = /^[1-9]\d*$/.test(quantity)
  const subtotal = selected && validQuantity
    ? new Decimal(selected.unitPrice)
      .times(quantity)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
      .toFixed(2)
    : undefined

  const save = () => {
    if (!selected || !subtotal || !validQuantity) return
    const sales = form.getValues('lubricantSales')
    const existingIndex = sales.findIndex(
      (sale, index) => sale.productId === selected.id && index !== lubricantSaleIndex,
    )
    if (existingIndex >= 0) {
      const existing = sales[existingIndex]
      const combinedQuantity = new Decimal(existing.quantity).plus(quantity).toFixed(0)
      lubricants.update(existingIndex, {
        ...existing,
        quantity: combinedQuantity,
        amount: new Decimal(existing.unitPrice)
          .times(combinedQuantity)
          .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
          .toFixed(2),
      })
      if (lubricantSaleIndex !== undefined) lubricants.remove(lubricantSaleIndex)
    } else {
      const value = {
        id: current?.id ?? crypto.randomUUID(),
        productId: selected.id,
        productName: selected.name,
        unit: selected.unit,
        unitPrice: selected.unitPrice,
        quantity,
        amount: subtotal,
      }
      if (lubricantSaleIndex === undefined) lubricants.append(value)
      else lubricants.update(lubricantSaleIndex, value)
    }
    closeLubricantSale()
  }

  return (
    <>
      <Sheet
        open
        title={current ? 'Edit lubricant sale' : 'Add lubricant sale'}
        description="Record a lubricant product and quantity."
        escapeDisabled={selectingProduct}
        manageFocus
        onClose={closeLubricantSale}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5">
            <div>
              <button
                type="button"
                className="flex min-h-11 w-full items-center gap-3 rounded-sm border border-input px-3 text-left outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/10"
                onClick={() => setSelectingProduct(true)}
              >
                <span className="min-w-0 flex-1">
                  {selected ? (
                    <span className="block truncate font-medium">
                      {selected.name} · {selected.unit}
                    </span>
                  ) : (
                    <span className="text-text-tertiary">Select lubricant product</span>
                  )}
                </span>
                <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-text-tertiary" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Price</span>
                <div className="flex min-h-11 items-center rounded-md bg-muted px-3 font-medium tabular-nums text-text-heading">
                  {selected ? formatMoney(selected.unitPrice) : '—'}
                </div>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Quantity</span>
                <Input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quantity}
                  aria-invalid={!validQuantity}
                  onChange={(event) => {
                    if (/^\d*$/.test(event.target.value)) setQuantity(event.target.value)
                  }}
                />
              </label>
            </div>
            {!validQuantity && (
              <p className="text-sm text-destructive">
                Use a whole number greater than zero.
              </p>
            )}

            <div className="flex min-h-12 items-center justify-between border-t border-border/60 font-medium">
              <span>Subtotal</span>
              <span className="tabular-nums">{subtotal ? formatMoney(subtotal) : '—'}</span>
            </div>
          </div>

          <footer className="shrink-0 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={closeLubricantSale}>
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!selected || !validQuantity || !subtotal}
                onClick={save}
              >
                Save
              </Button>
            </div>
          </footer>
        </div>
      </Sheet>

      {selectingProduct && (
        <LubricantProductSelectSheet
          tenantId={tenantId}
          selectedId={selected?.id}
          onSelect={(product) => {
            setSelected(product)
            setSelectingProduct(false)
          }}
          onClose={() => setSelectingProduct(false)}
        />
      )}
    </>
  )
}

function LubricantProductSelectSheet({
  tenantId,
  selectedId,
  onSelect,
  onClose,
}: {
  tenantId: string
  selectedId?: string
  onSelect: (product: InventoryProductFieldsFragment) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const products = useInventoryProductsQuery(tenantId, {
    search,
    activeOnly: true,
    offset: 0,
    limit: 100,
  })
  const options = products.data?.items ?? []

  return (
    <Sheet
      open
      layer="nested"
      title="Select lubricant product"
      description="Search available lubricant products."
      manageFocus
      onClose={onClose}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <label className="relative shrink-0">
          <span className="sr-only">Search lubricant products</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary"
          />
          <Input
            autoFocus
            className="pl-9"
            value={search}
            placeholder="Search lubricant products"
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {products.isPending ? (
            <div className="flex min-h-40 items-center justify-center">
              <Spinner className="size-5" />
            </div>
          ) : products.isError ? (
            <p className="text-sm text-destructive">Unable to load lubricant products.</p>
          ) : (
            <div role="radiogroup" aria-label="Lubricant products" className="overflow-hidden rounded-md border border-border/70">
              {options.map((product) => {
                const isSelected = product.id === selectedId
                return (
                  <button
                    key={product.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={cn(
                      'flex min-h-14 w-full items-center justify-between gap-4 border-b border-border/60 px-4 py-3 text-left outline-none transition-colors last:border-0 hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30',
                      isSelected && 'bg-primary/5',
                    )}
                    onClick={() => onSelect(product)}
                  >
                    <span className="min-w-0 flex-1 truncate font-medium text-text-heading">
                      {product.name} · {product.unit}
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-text-secondary">
                      {formatMoney(product.unitPrice)}
                    </span>
                  </button>
                )
              })}
              {options.length === 0 && (
                <p className="p-4 text-sm text-text-secondary">No lubricant products found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Sheet>
  )
}

function currentProduct(current: {
  productId: string
  productName: string
  unit: string
  unitPrice: string
}): InventoryProductFieldsFragment {
  return {
    id: current.productId,
    name: current.productName,
    unit: current.unit,
    unitPrice: current.unitPrice,
    stockCount: '0',
    status: 'inactive',
    revision: 0,
  }
}
