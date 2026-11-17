'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Sheet } from '~/components/ui/sheet'
import { Spinner } from '~/components/ui/spinner'
import { Textarea } from '~/components/ui/textarea'
import type { InventoryProductFieldsFragment } from '~/generated/graphql'
import { useReconcileInventoryProductCountMutation } from '../inventory.queries'
import { reconcileCountFormSchema, type ReconcileCountFormValues } from './inventory-form.schema'

type Submission = { signature: string; idempotencyKey: string }

export function ReconcileCountSheet({ tenantId, product, onClose }: { tenantId: string; product: InventoryProductFieldsFragment; onClose: () => void }) {
  const mutation = useReconcileInventoryProductCountMutation(tenantId)
  const [submission, setSubmission] = useState<Submission>()
  const form = useForm<ReconcileCountFormValues>({
    resolver: zodResolver(reconcileCountFormSchema),
    defaultValues: { stockCount: '', note: '' },
    mode: 'onChange',
  })
  const close = () => {
    if (!mutation.isPending) onClose()
  }
  const submit = form.handleSubmit(async (values) => {
    const input = {
      productId: product.id,
      stockCount: values.stockCount,
      note: values.note || undefined,
    }
    const signature = JSON.stringify(input)
    const currentSubmission = submission?.signature === signature
      ? submission
      : { signature, idempotencyKey: crypto.randomUUID() }
    if (currentSubmission !== submission) setSubmission(currentSubmission)
    try {
      await mutation.mutateAsync({ ...input, idempotencyKey: currentSubmission.idempotencyKey })
      toast.success('Stock count reconciled')
      onClose()
    } catch {
      form.setError('root', { message: 'Unable to reconcile the stock count.' })
    }
  })

  return (
    <Sheet
      open
      title="Reconcile stock count"
      description={`${product.name} · Current stock ${product.stockCount} ${product.unit}`}
      icon={RefreshCw}
      escapeDisabled={mutation.isPending}
      manageFocus
      onClose={close}
    >
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5">
          <p className="text-sm text-text-secondary">
            Replace the current stock balance with the counted quantity. The difference will be recorded in movement history.
          </p>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Counted stock</span>
            <Input
              autoFocus
              inputMode="numeric"
              disabled={mutation.isPending}
              aria-invalid={Boolean(form.formState.errors.stockCount)}
              {...form.register('stockCount')}
            />
            {form.formState.errors.stockCount?.message && (
              <span className="text-sm text-destructive">{form.formState.errors.stockCount.message}</span>
            )}
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Note <span className="font-normal text-text-tertiary">(optional)</span></span>
            <Textarea
              disabled={mutation.isPending}
              maxLength={240}
              placeholder="Reason for reconciling the count"
              aria-invalid={Boolean(form.formState.errors.note)}
              {...form.register('note')}
            />
            {form.formState.errors.note?.message && (
              <span className="text-sm text-destructive">{form.formState.errors.note.message}</span>
            )}
          </label>
          {form.formState.errors.root?.message && (
            <p role="alert" className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          )}
        </div>
        <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button type="button" variant="outline" className="flex-1" disabled={mutation.isPending} onClick={close}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={!form.formState.isValid || mutation.isPending}>
            {mutation.isPending && <Spinner className="size-4" />}
            {mutation.isPending ? 'Reconciling…' : 'Reconcile count'}
          </Button>
        </footer>
      </form>
    </Sheet>
  )
}
