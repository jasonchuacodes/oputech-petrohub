import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronRight, Container, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import type { FuelProductFieldsFragment, FuelTankFieldsFragment } from '~/generated/graphql'
import { FuelProductIcon } from '../../fuel-products/fuel-product-icon'
import { useCreateFuelTankMutation, useUpdateFuelTankMutation } from '../fuel-setup.queries'
import { fuelTankFormSchema, type FuelTankFormValues } from './fuel-setup.schema'
import { ProductSelectSheet } from './product-select-sheet'
import { SetupSheet } from './setup-sheet'

export function FuelTankSheet({
  tenantId,
  products,
  tank,
  onClose,
}: {
  tenantId: string
  products: FuelProductFieldsFragment[]
  tank?: FuelTankFieldsFragment
  onClose: () => void
}) {
  const activeProducts = products.filter((product) => product.status === 'active')
  const createTank = useCreateFuelTankMutation(tenantId)
  const updateTank = useUpdateFuelTankMutation(tenantId)
  const [selectingProduct, setSelectingProduct] = useState(false)
  const form = useForm<FuelTankFormValues>({
    resolver: zodResolver(fuelTankFormSchema),
    defaultValues: {
      label: tank?.label ?? '',
      productId: tank?.productId ?? activeProducts[0]?.id ?? '',
      currentReading: tank?.currentReading ?? '',
    },
    mode: 'onChange',
  })
  const productId = useWatch({ control: form.control, name: 'productId' })
  const selectedProduct = products.find((product) => product.id === productId)
  const pending = createTank.isPending || updateTank.isPending
  const submit = form.handleSubmit(async (values) => {
    try {
      if (tank) {
        await updateTank.mutateAsync({
          tankId: tank.id,
          expectedRevision: tank.revision,
          label: values.label,
          currentReading: values.currentReading || null,
          expectedCurrentReading: tank.currentReading,
        })
        toast.success('Tank updated')
      } else {
        await createTank.mutateAsync({ label: values.label, productId: values.productId })
        toast.success('Tank created')
      }
      onClose()
    } catch {
      form.setError('root', { message: `Unable to ${tank ? 'update' : 'create'} the tank. Refresh and try again.` })
    }
  })

  return (
    <>
      <SetupSheet
        open
        escapeDisabled={selectingProduct || pending}
        title={tank ? 'Edit tank' : 'Add tank'}
        description={tank ? 'Update the tank name or override its current reading. Fuel product cannot be changed.' : 'Add one entry for each physical fuel tank.'}
        icon={tank ? Pencil : Container}
        onClose={() => { if (!pending) onClose() }}
      >
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Tank name</span>
              <Input autoFocus placeholder="Tank 1" disabled={pending} aria-invalid={Boolean(form.formState.errors.label)} {...form.register('label')} />
              {form.formState.errors.label?.message && <p className="text-sm text-destructive">{form.formState.errors.label.message}</p>}
            </label>

            {tank ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Fuel product</span>
                <div className="flex min-h-11 items-center gap-3 rounded-sm border border-input bg-muted px-3 text-text-secondary wide:min-h-10">
                  {selectedProduct && <FuelProductIcon color={selectedProduct.color} className="size-4" />}
                  <span>{selectedProduct?.name ?? 'Unknown fuel product'}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Fuel product</span>
                <button type="button" className="flex min-h-11 items-center gap-3 rounded-sm border border-input px-3 text-left outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/10" onClick={() => setSelectingProduct(true)}>
                  {selectedProduct ? <FuelProductIcon color={selectedProduct.color} className="size-4" /> : <Container aria-hidden="true" className="size-4 text-primary" />}
                  <span className="min-w-0 flex-1 font-medium">{selectedProduct?.name ?? 'Select fuel product'}</span>
                  {selectedProduct ? <Check aria-hidden="true" className="size-4 text-status-success" /> : <ChevronRight aria-hidden="true" className="size-4 text-text-tertiary" />}
                </button>
                {form.formState.errors.productId?.message && <p className="text-sm text-destructive">{form.formState.errors.productId.message}</p>}
              </div>
            )}
            {tank && (
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Current reading</span>
                <Input
                  inputMode="decimal"
                  placeholder="Enter current reading"
                  disabled={pending}
                  aria-invalid={Boolean(form.formState.errors.currentReading)}
                  {...form.register('currentReading')}
                />
                <span className="text-xs text-text-tertiary">Changing this value creates a manual override in tank reading history.</span>
                {form.formState.errors.currentReading?.message && <p className="text-sm text-destructive">{form.formState.errors.currentReading.message}</p>}
              </label>
            )}
            {form.formState.errors.root?.message && <p role="alert" className="text-sm text-destructive">{form.formState.errors.root.message}</p>}
          </div>
          <div className="flex shrink-0 justify-end gap-3 border-t border-border px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Button type="button" variant="outline" disabled={pending} onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={pending || !form.formState.isValid}>
              {pending && <Spinner className="size-4" />}
              {tank ? 'Save changes' : 'Add tank'}
            </Button>
          </div>
        </form>
      </SetupSheet>
      {selectingProduct && (
        <ProductSelectSheet
          products={activeProducts}
          selectedId={productId}
          onSelect={(product) => { form.setValue('productId', product.id, { shouldDirty: true, shouldValidate: true }); setSelectingProduct(false) }}
          onClose={() => setSelectingProduct(false)}
        />
      )}
    </>
  )
}
