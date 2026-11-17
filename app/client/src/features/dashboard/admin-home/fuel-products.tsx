'use client'

import { Fuel, MoreVertical, RefreshCw } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { ContentSection } from '~/components/ui/content-section'
import { Spinner } from '~/components/ui/spinner'
import { FuelProductSheet } from '../../tenants/fuel-setup/fuel-product-sheet'
import { useFuelSetupQuery } from '../../tenants/fuel-setup.queries'

export function FuelProducts({ tenantId, timezone }: { tenantId: string; timezone: string }) {
  const setup = useFuelSetupQuery(tenantId)
  const [productEditorId, setProductEditorId] = useState<string>()
  const actionButtonRef = useRef<HTMLButtonElement>(null)
  const activeProducts = setup.data?.products.filter((product) => product.status === 'active') ?? []
  const productEditor = activeProducts.find((product) => product.id === productEditorId)

  return (
    <ContentSection
      label="Fuel prices today"
      headingClassName="font-sans text-sm font-semibold tracking-[0.14em] uppercase"
    >
      {setup.isPending ? (
        <div className="flex min-h-40 items-center justify-center rounded-md bg-card shadow-card">
          <Spinner className="size-6" />
        </div>
      ) : setup.isError && !setup.data ? (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
          <p className="text-sm text-text-secondary">Unable to load fuel products.</p>
          <Button type="button" variant="outline" onClick={() => void setup.refetch()}>
            <RefreshCw aria-hidden="true" /> Try again
          </Button>
        </div>
      ) : activeProducts.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Fuel aria-hidden="true" className="size-6" />
          </span>
          <div>
            <p className="font-medium text-text-heading">No active fuel products</p>
            <p className="mt-1 text-sm text-text-secondary">Active products will appear here.</p>
          </div>
        </div>
      ) : (
        <>
          {setup.isRefetchError && (
            <p className="mb-2 text-sm text-status-warning">Unable to refresh. Showing saved product data.</p>
          )}
          <div className="overflow-hidden rounded-md bg-border/60 shadow-card md:overflow-visible md:rounded-none md:bg-transparent md:shadow-none">
            <div className="grid grid-cols-1 gap-px md:grid-cols-[repeat(auto-fit,minmax(min(12rem,100%),1fr))] md:gap-3">
              {activeProducts.map((product) => (
                <article key={product.id} className="flex min-h-20 min-w-0 items-center gap-3 bg-card px-3 py-3 md:rounded-md md:shadow-card">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Fuel aria-hidden="true" className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-text-heading">{product.name}</h3>
                    <p className="mt-0.5 font-semibold tabular-nums text-text-heading">
                      ₱{formatPrice(product.unitPrice)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={`Edit price for ${product.name}`}
                    onClick={(event) => {
                      actionButtonRef.current = event.currentTarget
                      setProductEditorId(product.id)
                    }}
                  >
                    <MoreVertical aria-hidden="true" />
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </>
      )}

      {productEditor && (
        <FuelProductSheet
          key={productEditor.id}
          tenantId={tenantId}
          product={productEditor}
          mode="price"
          timezone={timezone}
          returnFocusRef={actionButtonRef}
          onClose={() => setProductEditorId(undefined)}
        />
      )}
    </ContentSection>
  )
}

function formatPrice(value: string) {
  const [whole, fraction = '00'] = value.split('.')
  return `${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`
}
