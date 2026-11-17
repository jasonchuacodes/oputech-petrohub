'use client'

import { Gauge, RefreshCw } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { ContentSection } from '~/components/ui/content-section'
import { Spinner } from '~/components/ui/spinner'
import { FuelProductIcon } from '../../fuel-products/fuel-product-icon'
import { useFuelSetupQuery } from '../../tenants/fuel-setup.queries'

export function CurrentTankReadings({ tenantId }: { tenantId: string }) {
  const setup = useFuelSetupQuery(tenantId)
  const activeTanks = setup.data?.tanks.filter((tank) => tank.status === 'active') ?? []

  return (
    <ContentSection label="Current tank readings">
      {setup.isPending ? (
        <div className="flex min-h-40 items-center justify-center rounded-md bg-card shadow-card">
          <Spinner className="size-6" />
        </div>
      ) : setup.isError && !setup.data ? (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
          <p className="text-sm text-text-secondary">Unable to load tank readings.</p>
          <Button type="button" variant="outline" onClick={() => void setup.refetch()}>
            <RefreshCw aria-hidden="true" /> Try again
          </Button>
        </div>
      ) : activeTanks.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Gauge aria-hidden="true" className="size-6" />
          </span>
          <div>
            <p className="font-medium text-text-heading">No active fuel tanks</p>
            <p className="mt-1 text-sm text-text-secondary">Active tanks will appear here.</p>
          </div>
        </div>
      ) : (
        <>
          {setup.isRefetchError && (
            <p className="mb-2 text-sm text-status-warning">Unable to refresh. Showing saved tank readings.</p>
          )}
          <div className="overflow-hidden rounded-md bg-border/60 shadow-card md:overflow-visible md:rounded-none md:bg-transparent md:shadow-none">
            <div className="grid grid-cols-1 gap-px md:grid-cols-[repeat(auto-fit,minmax(min(14rem,100%),1fr))] md:gap-3">
              {activeTanks.map((tank) => {
                const product = setup.data?.products.find((item) => item.id === tank.productId)
                return (
                  <article key={tank.id} className="flex min-h-20 min-w-0 items-center gap-3 bg-card px-3 py-3 md:rounded-md md:shadow-card">
                    <FuelProductIcon color={product?.color} tile className="size-4" containerClassName="size-9" />
                    <div className="min-w-0 flex-1">
                      <h3 title={tank.label} className="truncate text-sm font-medium text-text-heading">{tank.label}</h3>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-semibold tabular-nums text-text-heading">
                        {tank.currentReading === null ? '—' : formatReading(tank.currentReading)}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </>
      )}
    </ContentSection>
  )
}

function formatReading(value: string) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(Number(value))
}
