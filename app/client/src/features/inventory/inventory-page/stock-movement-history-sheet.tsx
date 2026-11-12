'use client'

import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Sheet } from '~/components/ui/sheet'
import { Spinner } from '~/components/ui/spinner'
import type { InventoryProductFieldsFragment } from '~/generated/graphql'
import { useStockMovementsQuery } from '../inventory.queries'

const pageSize = 20

export function StockMovementHistorySheet({ tenantId, product, onClose }: { tenantId: string; product: InventoryProductFieldsFragment; onClose: () => void }) {
  const [cursorHistory, setCursorHistory] = useState<string[]>([])
  const after = cursorHistory.at(-1)
  const movements = useStockMovementsQuery(tenantId, { productId: product.id, first: pageSize, after })

  return (
    <Sheet open title="Stock movement history" description={product.name} manageFocus onClose={onClose}>
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
            <ul className="overflow-hidden rounded-md border border-border/70">
              {movements.data.items.map((movement) => (
                <li key={movement.id} className="border-b border-border/60 p-4 last:border-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-text-heading">{movementLabel(movement.type)}</span>
                    <span className={movement.quantityChange.startsWith('-') ? 'font-medium tabular-nums text-destructive' : 'font-medium tabular-nums text-status-success'}>
                      {movement.quantityChange.startsWith('-') ? '' : '+'}{movement.quantityChange} {movement.unit}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">Balance: {movement.balanceBefore} → {movement.balanceAfter}</p>
                  {movement.reason && <p className="mt-1 text-sm text-text-secondary">{movement.reason}</p>}
                  <p className="mt-1 text-xs text-text-tertiary">{movement.actorName} · {new Date(movement.createdAt).toLocaleString()}</p>
                </li>
              ))}
              {movements.data.items.length === 0 && <li className="p-4 text-sm text-text-secondary">No stock movements.</li>}
            </ul>
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
  return 'Report reversal'
}
