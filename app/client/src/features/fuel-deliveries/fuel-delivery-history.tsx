'use client'

import { MoreVertical, Pencil, Trash2, Truck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Spinner } from '~/components/ui/spinner'
import type { FuelDeliveryFieldsFragment, FuelProductFieldsFragment, FuelTankFieldsFragment } from '~/generated/graphql'
import { useDeleteFuelDeliveryMutation, useFuelDeliveriesQuery } from './fuel-deliveries.queries'
import { FuelDeliverySheet } from './fuel-delivery-sheet'

const pageSize = 20

export function FuelDeliveryHistory({
  tenantId,
  timezone,
  products,
  tanks,
}: {
  tenantId: string
  timezone: string
  products: FuelProductFieldsFragment[]
  tanks: FuelTankFieldsFragment[]
}) {
  const [offset, setOffset] = useState(0)
  const deliveries = useFuelDeliveriesQuery(tenantId, { offset, limit: pageSize })
  const deleteDelivery = useDeleteFuelDeliveryMutation(tenantId)
  const [editor, setEditor] = useState<FuelDeliveryFieldsFragment>()
  const [deleting, setDeleting] = useState<FuelDeliveryFieldsFragment>()

  const remove = async () => {
    if (!deleting) return
    try {
      await deleteDelivery.mutateAsync({ deliveryId: deleting.id, expectedRevision: deleting.revision })
      toast.success('Fuel delivery deleted')
      setDeleting(undefined)
    } catch {
      toast.error('Unable to delete the fuel delivery. Refresh and try again.')
    }
  }

  return (
    <section aria-label="Fuel delivery history" className="space-y-3">
        {deliveries.isPending ? (
        <div className="flex min-h-40 items-center justify-center rounded-md bg-card shadow-card"><Spinner className="size-5" /></div>
      ) : deliveries.isError ? (
        <div className="rounded-md bg-card p-5 shadow-card"><p className="text-sm text-destructive">Unable to load fuel delivery history.</p><Button type="button" size="sm" variant="outline" className="mt-3" onClick={() => deliveries.refetch()}>Try again</Button></div>
      ) : (
        <>
          <div className="overflow-hidden rounded-md bg-card shadow-card md:hidden">
            {deliveries.data.items.map((delivery) => (
              <article key={delivery.id} className="border-b border-border/60 p-4 last:border-0">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><Truck aria-hidden="true" className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-heading">{formatDate(delivery.deliveryDate)}</p>
                    <p className="mt-1 text-sm text-text-secondary">{delivery.eventType === 'manual_override' ? 'Manual reading override' : delivery.lines.map((line) => `${line.productName}: ${formatNumber(line.quantity)} L`).join(' · ')}</p>
                  </div>
                  {delivery.eventType === 'delivery' && delivery.canManage && <DeliveryActions delivery={delivery} onEdit={() => setEditor(delivery)} onDelete={() => setDeleting(delivery)} />}
                </div>
                <div className="mt-3 space-y-1 border-t border-border/60 pt-3">
                  {delivery.readings.map((reading) => <p key={reading.tankId} className="text-sm"><span className="font-medium text-text-heading">{reading.tankLabel}</span><span className="text-text-secondary">: {formatReading(reading.beforeReading)} → {formatReading(reading.afterReading)}</span></p>)}
                  {delivery.notes && <p className="pt-1 text-sm text-text-secondary">{delivery.notes}</p>}
                  <p className="pt-1 text-xs text-text-tertiary">Recorded by {delivery.createdByName}{delivery.updatedByName ? ` · Updated by ${delivery.updatedByName}` : ''}</p>
                </div>
              </article>
            ))}
            {deliveries.data.items.length === 0 && <div className="flex min-h-40 flex-col items-center justify-center p-6 text-center"><Truck aria-hidden="true" className="mb-3 size-7 text-text-tertiary" /><p className="font-medium text-text-heading">No fuel deliveries</p><p className="mt-1 text-sm text-text-secondary">Record the first tanker delivery and tank readings.</p></div>}
          </div>

          <div className="hidden overflow-x-auto rounded-md bg-card shadow-card md:block">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/70"><th className="h-11 px-4 text-left text-xs font-medium text-text-secondary">Date</th><th className="h-11 px-4 text-left text-xs font-medium text-text-secondary">Event</th><th className="h-11 px-4 text-left text-xs font-medium text-text-secondary">Tank readings</th><th className="h-11 px-4 text-left text-xs font-medium text-text-secondary">Notes</th><th className="h-11 px-4 text-left text-xs font-medium text-text-secondary">Recorded by</th><th className="w-14" /></tr></thead>
              <tbody>
                {deliveries.data.items.map((delivery) => (
                  <tr key={delivery.id} className="border-b border-border/60 last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 align-top font-medium text-text-heading">{formatDate(delivery.deliveryDate)}</td>
                    <td className="px-4 py-3 align-top text-text-secondary">{delivery.eventType === 'manual_override' ? <span className="font-medium text-text-heading">Manual override</span> : delivery.lines.map((line) => <div key={line.productId}>{line.productName}: <span className="tabular-nums">{formatNumber(line.quantity)} L</span></div>)}</td>
                    <td className="px-4 py-3 align-top">{delivery.readings.map((reading) => <div key={reading.tankId}><span className="font-medium text-text-heading">{reading.tankLabel}</span>: <span className="whitespace-nowrap tabular-nums text-text-secondary">{formatReading(reading.beforeReading)} → {formatReading(reading.afterReading)}</span></div>)}</td>
                    <td className="max-w-64 px-4 py-3 align-top text-text-secondary">{delivery.notes || '—'}</td>
                    <td className="px-4 py-3 align-top text-text-secondary">{delivery.createdByName}{delivery.updatedByName && <span className="block text-xs text-text-tertiary">Updated by {delivery.updatedByName}</span>}</td>
                    <td className="px-2 py-2 align-top">{delivery.eventType === 'delivery' && delivery.canManage && <DeliveryActions delivery={delivery} onEdit={() => setEditor(delivery)} onDelete={() => setDeleting(delivery)} />}</td>
                  </tr>
                ))}
                {deliveries.data.items.length === 0 && <tr><td colSpan={6} className="h-40 px-4 text-center text-text-secondary">No fuel deliveries have been recorded.</td></tr>}
              </tbody>
            </table>
          </div>

          {(offset > 0 || offset + pageSize < deliveries.data.totalCount) && (
            <nav aria-label="Fuel delivery history pagination" className="flex items-center justify-between gap-3">
              <Button type="button" size="sm" variant="outline" disabled={offset === 0 || deliveries.isFetching} onClick={() => setOffset((value) => Math.max(0, value - pageSize))}>Newer</Button>
              <span className="text-sm text-text-secondary">{offset + 1}–{Math.min(offset + pageSize, deliveries.data.totalCount)} of {deliveries.data.totalCount}</span>
              <Button type="button" size="sm" variant="outline" disabled={offset + pageSize >= deliveries.data.totalCount || deliveries.isFetching} onClick={() => setOffset((value) => value + pageSize)}>Older</Button>
            </nav>
          )}
        </>
        )}

        {editor && <FuelDeliverySheet key={editor.id} tenantId={tenantId} timezone={timezone} products={products} tanks={tanks} delivery={editor} onClose={() => setEditor(undefined)} />}
        <ConfirmationDialog open={Boolean(deleting)} title="Delete fuel delivery?" description={deleting ? formatDate(deleting.deliveryDate) : undefined} icon={Trash2} variant="danger" confirmText="Delete" loading={deleteDelivery.isPending} onClose={() => setDeleting(undefined)} onConfirm={() => void remove()}>
          <p className="text-sm text-text-secondary">This removes the delivery from history and recalculates current tank readings from the remaining records. The deletion remains auditable.</p>
        </ConfirmationDialog>
    </section>
  )
}

function DeliveryActions({ delivery, onEdit, onDelete }: { delivery: FuelDeliveryFieldsFragment; onEdit: () => void; onDelete: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`Actions for delivery on ${delivery.deliveryDate}`} className="inline-flex size-9 items-center justify-center rounded-sm text-text-secondary outline-none hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-ring/30"><MoreVertical aria-hidden="true" className="size-4" /></DropdownMenuTrigger>
      <DropdownMenuContent align="end"><DropdownMenuItem onSelect={onEdit}><Pencil aria-hidden="true" /> Edit delivery</DropdownMenuItem><DropdownMenuItem variant="destructive" onSelect={onDelete}><Trash2 aria-hidden="true" /> Delete delivery</DropdownMenuItem></DropdownMenuContent>
    </DropdownMenu>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(`${value}T00:00:00`))
}

function formatNumber(value: string) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(Number(value))
}

function formatReading(value: string | null) {
  return value === null ? '—' : formatNumber(value)
}
