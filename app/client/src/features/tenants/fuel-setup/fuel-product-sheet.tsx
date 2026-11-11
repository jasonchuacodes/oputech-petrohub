import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import type { FuelProductFieldsFragment } from '~/generated/graphql'
import { useCreateFuelProductMutation, useUpdateFuelProductMutation } from '../fuel-setup.queries'
import { fuelProductFormSchema, type FuelProductFormValues } from './fuel-setup.schema'
import { SetupSheet } from './setup-sheet'

export function FuelProductSheet({ tenantId, product, onClose }: { tenantId: string; product?: FuelProductFieldsFragment; onClose: () => void }) {
  const createProduct = useCreateFuelProductMutation(tenantId)
  const updateProduct = useUpdateFuelProductMutation(tenantId)
  const form = useForm<FuelProductFormValues>({
    resolver: zodResolver(fuelProductFormSchema),
    defaultValues: product ? { name: product.name, unitPrice: product.unitPrice } : { name: '', unitPrice: '' },
    mode: 'onChange',
  })
  const pending = createProduct.isPending || updateProduct.isPending
  const submit = form.handleSubmit(async (values) => {
    try {
      if (product) await updateProduct.mutateAsync({ productId: product.id, expectedRevision: product.revision, ...values })
      else await createProduct.mutateAsync(values)
      toast.success(product ? 'Fuel product updated' : 'Fuel product created')
      onClose()
    } catch {
      form.setError('root', { message: 'Unable to save the fuel product. Refresh and try again.' })
    }
  })

  return <SetupSheet open title={product ? 'Edit fuel product' : 'Add fuel product'} description="Set the product name and selling price used by new reports." onClose={onClose}><form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}><div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5"><label className="flex flex-col gap-1.5"><span className="text-sm font-medium">Product name</span><Input autoFocus placeholder="ADO" disabled={pending} aria-invalid={Boolean(form.formState.errors.name)} {...form.register('name')} />{form.formState.errors.name?.message && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}</label><label className="flex flex-col gap-1.5"><span className="text-sm font-medium">Unit price</span><Input inputMode="decimal" placeholder="0.00" disabled={pending} aria-invalid={Boolean(form.formState.errors.unitPrice)} {...form.register('unitPrice')} />{form.formState.errors.unitPrice?.message && <p className="text-sm text-destructive">{form.formState.errors.unitPrice.message}</p>}</label>{form.formState.errors.root?.message && <p role="alert" className="text-sm text-destructive">{form.formState.errors.root.message}</p>}</div><footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"><Button type="button" variant="outline" className="flex-1" disabled={pending} onClick={onClose}>Cancel</Button><Button type="submit" className="flex-1" disabled={!form.formState.isValid || pending}>{pending ? <Spinner className="size-4" /> : <Save aria-hidden="true" />}{pending ? 'Saving…' : product ? 'Save changes' : 'Add product'}</Button></footer></form></SetupSheet>
}
