'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Sheet } from '~/components/ui/sheet'
import { Spinner } from '~/components/ui/spinner'
import type { InventoryProductFieldsFragment } from '~/generated/graphql'
import { useRecordStockMovementMutation } from '../inventory.queries'
import { stockMovementFormSchema, type StockMovementFormValues } from './inventory-form.schema'

export function StockMovementSheet({ tenantId, product, onClose }: { tenantId: string; product: InventoryProductFieldsFragment; onClose: () => void }) {
  const mutation = useRecordStockMovementMutation(tenantId)
  const form = useForm<StockMovementFormValues>({ resolver: zodResolver(stockMovementFormSchema), defaultValues: { type: 'stock_in', quantity: '', reason: '' }, mode: 'onChange' })
  const submit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ productId: product.id, ...values, idempotencyKey: crypto.randomUUID() })
      toast.success('Stock movement recorded')
      onClose()
    } catch {
      form.setError('root', { message: 'Unable to record the stock movement.' })
    }
  })
  return (
    <Sheet open title="Record stock movement" description={`${product.name} · Current stock ${product.stockCount} ${product.unit}`} manageFocus onClose={onClose}>
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5">
          <fieldset className="flex flex-col gap-1.5" disabled={mutation.isPending}>
            <legend className="text-sm font-medium">Movement</legend>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-input px-3 has-disabled:cursor-not-allowed has-disabled:opacity-60">
                <input type="radio" value="stock_in" className="size-4 accent-primary" {...form.register('type')} />
                <span>Stock in</span>
              </label>
              <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-input px-3 has-disabled:cursor-not-allowed has-disabled:opacity-60">
                <input type="radio" value="stock_out" className="size-4 accent-primary" {...form.register('type')} />
                <span>Stock out</span>
              </label>
            </div>
          </fieldset>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Quantity</span>
            <Input inputMode="numeric" disabled={mutation.isPending} {...form.register('quantity')} />
            {form.formState.errors.quantity?.message && <span className="text-sm text-destructive">{form.formState.errors.quantity.message}</span>}
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Reason</span>
            <Input disabled={mutation.isPending} maxLength={240} placeholder="Delivery, correction, loss…" {...form.register('reason')} />
            {form.formState.errors.reason?.message && <span className="text-sm text-destructive">{form.formState.errors.reason.message}</span>}
          </label>
          {form.formState.errors.root?.message && <p role="alert" className="text-sm text-destructive">{form.formState.errors.root.message}</p>}
        </div>
        <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button type="button" variant="outline" className="flex-1" disabled={mutation.isPending} onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={!form.formState.isValid || mutation.isPending}>
            {mutation.isPending && <Spinner className="size-4" />}
            {mutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        </footer>
      </form>
    </Sheet>
  )
}
