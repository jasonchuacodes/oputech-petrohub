'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Sheet } from '~/components/ui/sheet'
import { Spinner } from '~/components/ui/spinner'
import type { InventoryProductFieldsFragment } from '~/generated/graphql'
import { useCreateInventoryProductMutation, useUpdateInventoryProductMutation } from '../inventory.queries'
import { inventoryProductFormSchema, type InventoryProductFormValues } from './inventory-form.schema'

export function ProductSheet({ tenantId, product, onClose }: { tenantId: string; product?: InventoryProductFieldsFragment; onClose: () => void }) {
  const createProduct = useCreateInventoryProductMutation(tenantId)
  const updateProduct = useUpdateInventoryProductMutation(tenantId)
  const form = useForm<InventoryProductFormValues>({
    resolver: zodResolver(inventoryProductFormSchema),
    defaultValues: product
      ? { name: product.name, unit: product.unit, unitPrice: product.unitPrice, openingStock: product.stockCount }
      : { name: '', unit: '', unitPrice: '', openingStock: '0' },
    mode: 'onChange',
  })
  const pending = createProduct.isPending || updateProduct.isPending
  const submit = form.handleSubmit(async (values) => {
    try {
      if (product) {
        await updateProduct.mutateAsync({ productId: product.id, expectedRevision: product.revision, name: values.name, unit: values.unit, unitPrice: values.unitPrice })
      } else {
        await createProduct.mutateAsync({ ...values, idempotencyKey: crypto.randomUUID() })
      }
      toast.success(product ? 'Lubricant product updated' : 'Lubricant product created')
      onClose()
    } catch {
      form.setError('root', { message: 'Unable to save the lubricant product. Refresh and try again.' })
    }
  })

  return (
    <Sheet open title={product ? 'Edit lubricant' : 'Add lubricant'} description="Configure the inventory unit and selling price." manageFocus onClose={onClose}>
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5">
          <Field label="Product name" error={form.formState.errors.name?.message}><Input autoFocus disabled={pending} placeholder="Engine Oil 1L" {...form.register('name')} /></Field>
          <Field label="Unit" error={form.formState.errors.unit?.message}><Input disabled={pending} placeholder="bottle" {...form.register('unit')} /></Field>
          <Field label="Unit price" error={form.formState.errors.unitPrice?.message}><Input inputMode="decimal" disabled={pending} placeholder="0.00" {...form.register('unitPrice')} /></Field>
          {!product && <Field label="Opening stock" error={form.formState.errors.openingStock?.message}><Input inputMode="numeric" disabled={pending} {...form.register('openingStock')} /></Field>}
          {form.formState.errors.root?.message && <p role="alert" className="text-sm text-destructive">{form.formState.errors.root.message}</p>}
        </div>
        <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button type="button" variant="outline" className="flex-1" disabled={pending} onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={!form.formState.isValid || pending}>{pending && <Spinner className="size-4" />}{pending ? 'Saving…' : 'Save'}</Button>
        </footer>
      </form>
    </Sheet>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1.5"><span className="text-sm font-medium">{label}</span>{children}{error && <span className="text-sm text-destructive">{error}</span>}</label>
}
