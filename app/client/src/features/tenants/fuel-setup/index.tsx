'use client'

import { Fuel, Gauge, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog'
import { DataTable, type DataTableColumn } from '~/components/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { PageHeader } from '~/components/ui/page-header'
import { Spinner } from '~/components/ui/spinner'
import type { FuelProductFieldsFragment, PumpMeterFieldsFragment } from '~/generated/graphql'
import { cn } from '~/utils/cn'
import { useActiveTenant } from '../../layout/use-active-tenant'
import {
  useDeactivateFuelProductMutation,
  useDeactivatePumpMeterMutation,
  useFuelSetupQuery,
} from '../fuel-setup.queries'
import { FuelProductSheet } from './fuel-product-sheet'
import { PumpMeterSheet } from './pump-meter-sheet'
import { SetupSheet } from './setup-sheet'

type SetupTab = 'products' | 'meters'
type ProductEditor = FuelProductFieldsFragment | 'new' | null
type DeactivationTarget =
  | { kind: 'product'; item: FuelProductFieldsFragment }
  | { kind: 'meter'; item: PumpMeterFieldsFragment }

export function FuelSetupPage() {
  const access = useActiveTenant()
  const canManage = access.role === 'admin' || access.role === 'superadmin'
  if (!canManage) return <div className="mx-auto max-w-xl p-6 text-sm text-text-secondary">Only administrators can manage fuel setup.</div>
  return <TenantFuelSetup key={access.tenant.id} tenantId={access.tenant.id} timezone={access.tenant.timezone} />
}

function TenantFuelSetup({ tenantId, timezone }: { tenantId: string; timezone: string }) {
  const setup = useFuelSetupQuery(tenantId)
  const deactivateProduct = useDeactivateFuelProductMutation(tenantId)
  const deactivateMeter = useDeactivatePumpMeterMutation(tenantId)
  const [tab, setTab] = useState<SetupTab>('products')
  const [productEditor, setProductEditor] = useState<ProductEditor>(null)
  const [addingMeter, setAddingMeter] = useState(false)
  const [meterEditor, setMeterEditor] = useState<PumpMeterFieldsFragment>()
  const [productActions, setProductActions] = useState<FuelProductFieldsFragment>()
  const [meterActions, setMeterActions] = useState<PumpMeterFieldsFragment>()
  const [deactivation, setDeactivation] = useState<DeactivationTarget>()
  const pending = deactivateProduct.isPending || deactivateMeter.isPending

  if (setup.isPending) return <div className="flex min-h-64 items-center justify-center"><Spinner className="size-6" /></div>
  if (setup.isError) return <div className="mx-auto max-w-xl p-6"><p className="text-sm text-destructive">Unable to load fuel setup.</p><Button className="mt-3" variant="outline" onClick={() => void setup.refetch()}>Try again</Button></div>

  const deactivate = async () => {
    if (!deactivation) return
    try {
      if (deactivation.kind === 'product') {
        await deactivateProduct.mutateAsync({ id: deactivation.item.id, expectedRevision: deactivation.item.revision })
        toast.success('Fuel product deactivated')
      } else {
        await deactivateMeter.mutateAsync({ id: deactivation.item.id, expectedRevision: deactivation.item.revision })
        toast.success('Pump meter deactivated')
      }
      setDeactivation(undefined)
    } catch {
      toast.error(deactivation.kind === 'product' ? 'Deactivate the product’s active meters first.' : 'Unable to deactivate the pump meter.')
    }
  }

  const selectedProduct = productEditor && productEditor !== 'new' ? productEditor : undefined
  const deactivationDescription = deactivation
    ? deactivation.kind === 'product'
      ? deactivation.item.name
      : deactivation.item.label
    : undefined
  const productColumns: DataTableColumn<FuelProductFieldsFragment>[] = [
    {
      id: 'name',
      heading: 'Product',
      cell: (product) => <span className="font-medium text-text-heading">{product.name}</span>,
    },
    {
      id: 'unitPrice',
      heading: 'Unit price',
      align: 'right',
      cell: (product) => (
        <span className="font-medium tabular-nums text-text-heading">
          ₱{formatPrice(product.unitPrice)}
        </span>
      ),
    },
    {
      id: 'status',
      heading: 'Status',
      cell: (product) => <Status status={product.status} />,
    },
    {
      id: 'actions',
      heading: '',
      align: 'right',
      width: 64,
      cell: (product) => (
        <FuelProductRowActions
          product={product}
          onEdit={() => setProductEditor(product)}
          onDeactivate={() => setDeactivation({ kind: 'product', item: product })}
        />
      ),
    },
  ]
  const meterColumns: DataTableColumn<PumpMeterFieldsFragment>[] = [
    {
      id: 'label',
      heading: 'Pump',
      cell: (meter) => <span className="font-medium text-text-heading">{meter.label}</span>,
    },
    {
      id: 'productId',
      heading: 'Fuel product',
      cell: (meter) => setup.data.products.find((product) => product.id === meter.productId)?.name ?? 'Unknown fuel product',
    },
    {
      id: 'currentReading',
      heading: 'Current reading',
      align: 'right',
      cell: (meter) => (
        <span className="font-semibold tabular-nums text-text-heading">
          {formatReading(meter.currentReading)}
        </span>
      ),
    },
    {
      id: 'status',
      heading: 'Status',
      cell: (meter) => <Status status={meter.status} />,
    },
    {
      id: 'actions',
      heading: '',
      align: 'right',
      width: 64,
      cell: (meter) => (
        <PumpMeterRowActions
          meter={meter}
          onEdit={() => setMeterEditor(meter)}
          onDeactivate={() => setDeactivation({ kind: 'meter', item: meter })}
        />
      ),
    },
  ]

  return (
    <div className="mx-auto flex w-full flex-col gap-5 px-5 py-5 md:max-w-4xl md:p-6 wide:max-w-7xl">
      <PageHeader
        title="Fuel setup"
        description="Configure your products and view pump readings."
        backHref="/me"
        backLabel="Back to Me"
        backVisibility="mobile"
      />

      <div role="tablist" aria-label="Fuel setup sections" className="flex rounded-md bg-muted p-1">
        <button type="button" role="tab" aria-selected={tab === 'products'} className={cn('min-h-11 flex-1 rounded-sm px-3 text-sm font-medium', tab === 'products' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-text-secondary')} onClick={() => setTab('products')}>Products</button>
        <button type="button" role="tab" aria-selected={tab === 'meters'} className={cn('min-h-11 flex-1 rounded-sm px-3 text-sm font-medium', tab === 'meters' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-text-secondary')} onClick={() => setTab('meters')}>Pumps</button>
      </div>

      {tab === 'products' ? (
        <section role="tabpanel" aria-label="Fuel products">
          {setup.data.products.length === 0 ? (
            <EmptyCard icon={Fuel} title="No fuel products" description="Add the first fuel product and its selling price." />
          ) : (
            <>
              <div className="overflow-hidden rounded-md bg-card shadow-card md:hidden">
                {setup.data.products.map((product) => (
                  <article key={product.id} className="flex min-h-20 items-center gap-3 border-b border-border/60 p-4 last:border-b-0">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Fuel aria-hidden="true" className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-text-heading">{product.name}</h3>
                        <Status status={product.status} />
                      </div>
                      <p className="mt-1 text-sm font-medium tabular-nums">₱{formatPrice(product.unitPrice)}</p>
                    </div>
                    <Button type="button" size="icon" variant="ghost" aria-label={`Actions for ${product.name}`} onClick={() => setProductActions(product)}>
                      <MoreVertical aria-hidden="true" />
                    </Button>
                  </article>
                ))}
              </div>
              <div className="hidden md:block">
                <DataTable
                  collection={DataTable.collection({
                    items: setup.data.products,
                    itemToValue: (product) => product.id,
                    itemToString: (product) => `${product.name} fuel product`,
                  })}
                  columns={productColumns}
                />
              </div>
            </>
          )}
          <Button type="button" variant="outline" className="mt-4 w-full" onClick={() => setProductEditor('new')}><Plus aria-hidden="true" />Add product</Button>
        </section>
      ) : (
        <section role="tabpanel" aria-label="Pump meters">
          {setup.data.meters.length === 0 ? (
            <EmptyCard icon={Gauge} title="No pump meters" description="Add one card for each independently incrementing physical meter." />
          ) : (
            <>
              <div className="overflow-hidden rounded-md bg-card shadow-card md:hidden">
                {setup.data.meters.map((meter) => {
                  const product = setup.data.products.find((item) => item.id === meter.productId)
                  return (
                    <article key={meter.id} className="border-b border-border/60 p-4 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Gauge aria-hidden="true" className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-text-heading">{meter.label}</h3>
                            <Status status={meter.status} />
                          </div>
                          <p className="mt-1 text-sm text-text-secondary">{product?.name ?? 'Unknown fuel product'}</p>
                        </div>
                        <Button type="button" size="icon" variant="ghost" aria-label={`Actions for ${meter.label}`} onClick={() => setMeterActions(meter)}>
                          <MoreVertical aria-hidden="true" />
                        </Button>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-4 sm:ml-13">
                        <span className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Current reading</span>
                        <span className="text-base font-semibold tabular-nums text-text-heading">{formatReading(meter.currentReading)}</span>
                      </div>
                    </article>
                  )
                })}
              </div>
              <div className="hidden md:block">
                <DataTable
                  collection={DataTable.collection({
                    items: setup.data.meters,
                    itemToValue: (meter) => meter.id,
                    itemToString: (meter) => `${meter.label} pump meter`,
                  })}
                  columns={meterColumns}
                />
              </div>
            </>
          )}
          <Button type="button" variant="outline" className="mt-4 w-full" disabled={setup.data.products.every((product) => product.status !== 'active')} onClick={() => setAddingMeter(true)}><Plus aria-hidden="true" />Add meter</Button>
        </section>
      )}

      {productEditor && <FuelProductSheet key={selectedProduct?.id ?? 'new'} tenantId={tenantId} product={selectedProduct} timezone={timezone} onClose={() => setProductEditor(null)} />}
      {addingMeter && <PumpMeterSheet tenantId={tenantId} products={setup.data.products} onClose={() => setAddingMeter(false)} />}
      {meterEditor && <PumpMeterSheet key={meterEditor.id} tenantId={tenantId} products={setup.data.products} meter={meterEditor} onClose={() => setMeterEditor(undefined)} />}

      {productActions && <SetupSheet open title="Fuel product actions" description={`${productActions.name} · ₱${formatPrice(productActions.unitPrice)}`} onClose={() => setProductActions(undefined)}><div className="flex flex-col gap-2 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"><Button type="button" variant="outline" className="w-full" disabled={productActions.status !== 'active'} onClick={() => { setProductEditor(productActions); setProductActions(undefined) }}><Pencil aria-hidden="true" />Edit product</Button><Button type="button" variant="destructive" className="w-full" disabled={productActions.status !== 'active'} onClick={() => { setDeactivation({ kind: 'product', item: productActions }); setProductActions(undefined) }}><Trash2 aria-hidden="true" />Deactivate product</Button></div></SetupSheet>}
      {meterActions && <SetupSheet open title="Pump meter actions" description={meterActions.label} onClose={() => setMeterActions(undefined)}><div className="flex flex-col gap-2 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"><Button type="button" variant="outline" className="w-full" disabled={meterActions.status !== 'active'} onClick={() => { setMeterEditor(meterActions); setMeterActions(undefined) }}><Pencil aria-hidden="true" />Edit pump</Button><Button type="button" variant="destructive" className="w-full" disabled={meterActions.status !== 'active'} onClick={() => { setDeactivation({ kind: 'meter', item: meterActions }); setMeterActions(undefined) }}><Trash2 aria-hidden="true" />Deactivate meter</Button></div></SetupSheet>}

      <ConfirmationDialog open={Boolean(deactivation)} title={`Deactivate ${deactivation?.kind === 'product' ? 'fuel product' : 'pump meter'}?`} description={deactivationDescription} icon={Trash2} variant="danger" confirmText="Deactivate" loading={pending} onClose={() => setDeactivation(undefined)} onConfirm={() => void deactivate()}><p className="text-sm text-text-secondary">Existing reports keep their saved product and meter details. Inactive setup is not included in new reports.</p></ConfirmationDialog>
    </div>
  )
}

function FuelProductRowActions({
  product,
  onEdit,
  onDeactivate,
}: {
  product: FuelProductFieldsFragment
  onEdit: () => void
  onDeactivate: () => void
}) {
  const inactive = product.status !== 'active'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${product.name}`}
        className="inline-flex size-9 items-center justify-center rounded-sm text-text-secondary outline-none hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <MoreVertical aria-hidden="true" className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled={inactive} onSelect={onEdit}>
          <Pencil aria-hidden="true" /> Edit product
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" disabled={inactive} onSelect={onDeactivate}>
          <Trash2 aria-hidden="true" /> Deactivate product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function PumpMeterRowActions({
  meter,
  onEdit,
  onDeactivate,
}: {
  meter: PumpMeterFieldsFragment
  onEdit: () => void
  onDeactivate: () => void
}) {
  const inactive = meter.status !== 'active'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${meter.label}`}
        className="inline-flex size-9 items-center justify-center rounded-sm text-text-secondary outline-none hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <MoreVertical aria-hidden="true" className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled={inactive} onSelect={onEdit}>
          <Pencil aria-hidden="true" /> Edit pump
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" disabled={inactive} onSelect={onDeactivate}>
          <Trash2 aria-hidden="true" /> Deactivate meter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function EmptyCard({ icon: Icon, title, description }: { icon: typeof Fuel; title: string; description: string }) {
  return <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card"><span className="flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary"><Icon aria-hidden="true" className="size-5" /></span><div><p className="font-medium text-text-heading">{title}</p><p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p></div></div>
}

function Status({ status }: { status: 'active' | 'inactive' }) { return <span className={cn('inline-flex rounded-sm px-2 py-0.5 text-xs font-medium', status === 'active' ? 'bg-status-success/10 text-status-success' : 'bg-muted text-text-tertiary')}>{status === 'active' ? 'Active' : 'Inactive'}</span> }
function formatPrice(value: string) { const [whole, fraction = '00'] = value.split('.'); return `${whole}.${fraction.padEnd(2, '0').slice(0, 2)}` }
function formatReading(value: string) { const [whole, fraction = ''] = value.split('.'); return `${whole}.${fraction.padEnd(3, '0').slice(0, 3)}` }
