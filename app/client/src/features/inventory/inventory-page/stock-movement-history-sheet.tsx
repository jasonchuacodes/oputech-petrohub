'use client'

import { History } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Sheet } from '~/components/ui/sheet'
import { Spinner } from '~/components/ui/spinner'
import type { InventoryProductFieldsFragment } from '~/generated/graphql'
import { useStockMovementsQuery } from '../inventory.queries'

const pageSize = 50

export function StockMovementHistorySheet({ tenantId, product, onClose }: { tenantId: string; product: InventoryProductFieldsFragment; onClose: () => void }) {
  const [cursorHistory, setCursorHistory] = useState<string[]>([])
  const after = cursorHistory.at(-1)
  const movements = useStockMovementsQuery(tenantId, { productId: product.id, first: pageSize, after })

  return (
    <Sheet
      open
      title="Stock movement history"
      description={product.name}
      icon={History}
      manageFocus
      panelClassName="wide:max-w-4xl"
      onClose={onClose}
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        {movements.isPending ? (
          <div className="flex min-h-40 items-center justify-center"><Spinner className="size-5" /></div>
        ) : movements.isError ? (
          <div className="space-y-3 py-4">
            <p className="text-sm text-destructive">Unable to load stock movements.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => movements.refetch()}>Try again</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <ul className="overflow-hidden rounded-md border border-border/70 md:hidden">
              {movements.data.items.map((movement) => (
                <li key={movement.id} className="border-b border-border/60 p-4 last:border-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-text-heading">{movementLabel(movement.type)}</span>
                    <span className={`font-medium tabular-nums ${movementChange(movement.quantityChange).tone}`}>
                      {movementChange(movement.quantityChange).label} {movement.unit}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">Balance: {movement.balanceBefore} → {movement.balanceAfter}</p>
                  {movement.reason && <p className="mt-1 text-sm text-text-secondary">{movement.reason}</p>}
                  <p className="mt-1 text-xs text-text-tertiary">{movement.actorName} · {new Date(movement.createdAt).toLocaleString()}</p>
                </li>
              ))}
              {movements.data.items.length === 0 && <li className="p-4 text-sm text-text-secondary">No stock movements.</li>}
            </ul>
            <div className="hidden overflow-x-auto rounded-md border border-border/70 md:block">
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-48" />
                  <col className="w-36" />
                  <col className="w-36" />
                  <col />
                </colgroup>
                <thead>
                  <tr className="border-b border-border bg-card">
                    <th scope="col" className="h-11 px-4 text-left text-xs font-medium whitespace-nowrap text-text-secondary">Occurred at</th>
                    <th scope="col" className="h-11 px-4 text-left text-xs font-medium whitespace-nowrap text-text-secondary">Reason</th>
                    <th scope="col" className="h-11 px-4 text-right text-xs font-medium whitespace-nowrap text-text-secondary">Change</th>
                    <th scope="col" className="h-11 px-4 text-left text-xs font-medium whitespace-nowrap text-text-secondary">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.data.items.map((movement) => {
                    const change = movementChange(movement.quantityChange)
                    return (
                      <tr key={movement.id} className="border-b border-border/60 bg-card last:border-b-0">
                        <td className="px-4 py-3 align-top">
                          <time dateTime={movement.createdAt} className="whitespace-nowrap tabular-nums text-text-secondary">
                            {new Date(movement.createdAt).toLocaleString()}
                          </time>
                        </td>
                        <td className="px-4 py-3 align-top font-medium text-text-heading">
                          {movementLabel(movement.type)}
                        </td>
                        <td className={`px-4 py-3 text-right align-top font-medium whitespace-nowrap tabular-nums ${change.tone}`}>
                          {change.label} {movement.unit}
                        </td>
                        <td className="px-4 py-3 align-top break-words text-text-secondary">
                          {movement.reason || '—'}
                        </td>
                      </tr>
                    )
                  })}
                  {movements.data.items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="h-32 px-4 text-center text-text-secondary">No stock movements.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {(cursorHistory.length > 0 || movements.data.pageInfo.hasNextPage) && (
              <nav aria-label="Stock movement history pagination" className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={cursorHistory.length === 0 || movements.isFetching}
                  onClick={() => setCursorHistory((history) => history.slice(0, -1))}
                >
                  Newer
                </Button>
                <span className="text-sm text-text-secondary">Page {cursorHistory.length + 1}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!movements.data.pageInfo.hasNextPage || !movements.data.pageInfo.endCursor || movements.isFetching}
                  onClick={() => {
                    const cursor = movements.data.pageInfo.endCursor
                    if (cursor) setCursorHistory((history) => [...history, cursor])
                  }}
                >
                  Older
                </Button>
              </nav>
            )}
          </div>
        )}
      </div>
    </Sheet>
  )
}

function movementLabel(type: string) {
  if (type === 'opening') return 'Opening stock'
  if (type === 'stock_in') return 'Stock in'
  if (type === 'stock_out') return 'Stock out'
  if (type === 'report_sale') return 'Report sale'
  if (type === 'report_reversal') return 'Report reversal'
  if (type === 'reconcile_count') return 'Reconcile count'
  return 'Stock movement'
}

function movementChange(value: string) {
  const zero = /^-?0(?:\.0+)?$/.test(value)
  if (zero) return { label: value.replace(/^-/, ''), tone: 'text-text-secondary' }
  if (value.startsWith('-')) return { label: value, tone: 'text-destructive' }
  return { label: `+${value}`, tone: 'text-status-success' }
}
