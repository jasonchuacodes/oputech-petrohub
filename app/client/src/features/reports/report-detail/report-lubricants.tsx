'use client'

import { ChevronRight, CirclePlus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Sheet } from '~/components/ui/sheet'
import { useReportEditor } from './report-editor-context'
import { formatMoney } from './utils'

export function ReportLubricantsPanel() {
  const { canEdit, lubricants, openLubricantSale, preview } = useReportEditor()
  const [actionIndex, setActionIndex] = useState<number>()
  const actionSale = actionIndex === undefined ? undefined : lubricants.fields[actionIndex]

  return (
    <div role="tabpanel" className="mt-5 flex flex-col gap-5 pb-5">
      <section>
        <div className="flex min-h-10 items-center justify-between">
          <h2 className="font-sans text-sm font-semibold tracking-[0.14em] text-text-heading uppercase">
            Lubricant sales
          </h2>
        </div>
        <div className="overflow-hidden rounded-md bg-card px-4 shadow-card">
          {lubricants.fields.map((sale, index) => {
            const content = (
              <>
                <span className="flex min-w-0 flex-1 items-baseline gap-1.5">
                  <span className="truncate font-medium text-text-heading">
                    {sale.productName}
                  </span>
                  <span className="shrink-0 text-sm font-normal text-text-secondary">
                    · {sale.quantity} {sale.unit}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-text-heading">
                  {formatMoney(sale.amount)}
                </span>
                {canEdit && (
                  <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-text-tertiary" />
                )}
              </>
            )

            return canEdit ? (
              <button
                key={sale.fieldKey}
                type="button"
                className="flex min-h-16 w-full items-center gap-3 border-b border-border/60 py-3 text-left outline-none hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30"
                onClick={() => setActionIndex(index)}
              >
                {content}
              </button>
            ) : (
              <article
                key={sale.fieldKey}
                className="flex min-h-16 items-center gap-3 border-b border-border/60 py-3"
              >
                {content}
              </article>
            )
          })}

          {lubricants.fields.length === 0 && (
            <p className="py-5 text-sm text-text-tertiary">No lubricant sales recorded.</p>
          )}

          {canEdit && (
            <button
              type="button"
              className="flex min-h-12 w-full items-center gap-2 border-b border-border/60 text-sm font-medium text-status-success"
              onClick={() => openLubricantSale()}
            >
              <CirclePlus aria-hidden="true" className="size-5" />
              Add lubricant sale
            </button>
          )}

          <div className="flex min-h-14 items-center justify-between font-medium">
            <span>Total</span>
            <span className="tabular-nums">{formatMoney(preview.lubricantSales)}</span>
          </div>
        </div>
      </section>

      {actionSale && actionIndex !== undefined && (
        <Sheet
          open
          title="Lubricant sale actions"
          description={`${actionSale.productName} · ${actionSale.quantity} ${actionSale.unit}`}
          manageFocus
          onClose={() => setActionIndex(undefined)}
        >
          <div className="flex flex-col gap-2 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setActionIndex(undefined)
                openLubricantSale(actionIndex)
              }}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                lubricants.remove(actionIndex)
                setActionIndex(undefined)
              }}
            >
              Delete
            </Button>
          </div>
        </Sheet>
      )}
    </div>
  )
}
