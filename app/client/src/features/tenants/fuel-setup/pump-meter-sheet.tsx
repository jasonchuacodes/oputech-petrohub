import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronRight, Gauge, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import type { FuelProductFieldsFragment, PumpMeterFieldsFragment } from '~/generated/graphql'
import { useCreatePumpMeterMutation, useUpdatePumpMeterMutation } from '../fuel-setup.queries'
import { pumpMeterFormSchema, type PumpMeterFormValues } from './fuel-setup.schema'
import { ProductSelectSheet } from './product-select-sheet'
import { SetupSheet } from './setup-sheet'

type PumpMeterSheetProps = {
  tenantId: string
  products: FuelProductFieldsFragment[]
  meter?: PumpMeterFieldsFragment
  onClose: () => void
}

export function PumpMeterSheet({ tenantId, products, meter, onClose }: PumpMeterSheetProps) {
  const activeProducts = products.filter((product) => product.status === 'active')
  const createMeter = useCreatePumpMeterMutation(tenantId)
  const updateMeter = useUpdatePumpMeterMutation(tenantId)
  const [selectingProduct, setSelectingProduct] = useState(false)
  const form = useForm<PumpMeterFormValues>({
    resolver: zodResolver(pumpMeterFormSchema),
    defaultValues: meter
      ? { label: meter.label, productId: meter.productId, initialReading: meter.initialReading }
      : { label: '', productId: activeProducts[0]?.id ?? '', initialReading: '0.000' },
    mode: 'onChange',
  })
  const selectedId = useWatch({ control: form.control, name: 'productId' })
  const selectedProduct = products.find((product) => product.id === selectedId)
  const pending = createMeter.isPending || updateMeter.isPending
  const close = () => {
    if (!pending) onClose()
  }
  const submit = form.handleSubmit(async (values) => {
    try {
      if (meter) {
        await updateMeter.mutateAsync({
          meterId: meter.id,
          expectedRevision: meter.revision,
          label: values.label,
        })
        toast.success('Pump updated')
      } else {
        await createMeter.mutateAsync(values)
        toast.success('Pump meter created')
      }
      onClose()
    } catch {
      form.setError('root', { message: `Unable to ${meter ? 'update' : 'create'} the pump. Refresh and try again.` })
    }
  })

  return (
    <>
      <SetupSheet
        open
        escapeDisabled={selectingProduct || pending}
        title={meter ? 'Edit pump' : 'Add pump meter'}
        description={meter
          ? 'Update the pump name. Fuel type cannot be changed.'
          : 'Create one entry for each independently incrementing physical meter.'}
        onClose={close}
      >
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Pump name</span>
              <Input
                autoFocus
                placeholder="ADO 1"
                disabled={pending}
                aria-invalid={Boolean(form.formState.errors.label)}
                {...form.register('label')}
              />
              {form.formState.errors.label?.message && (
                <p className="text-sm text-destructive">{form.formState.errors.label.message}</p>
              )}
            </label>

            {meter ? (
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Fuel type</span>
                <Input
                  value={selectedProduct?.name ?? 'Unknown fuel product'}
                  readOnly
                  aria-readonly="true"
                  className="bg-muted text-text-secondary"
                />
              </label>
            ) : (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Fuel product</span>
                <button
                  type="button"
                  className="flex min-h-11 items-center gap-3 rounded-sm border border-input px-3 text-left outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/10"
                  onClick={() => setSelectingProduct(true)}
                >
                  <Gauge aria-hidden="true" className="size-4 text-primary" />
                  <span className="min-w-0 flex-1">
                    {selectedProduct ? (
                      <>
                        <span className="block font-medium">{selectedProduct.name}</span>
                        <span className="block text-xs text-text-tertiary">₱{formatPrice(selectedProduct.unitPrice)}</span>
                      </>
                    ) : (
                      <span className="text-text-tertiary">Select fuel product</span>
                    )}
                  </span>
                  {selectedProduct
                    ? <Check aria-hidden="true" className="size-4 text-status-success" />
                    : <ChevronRight aria-hidden="true" className="size-4 text-text-tertiary" />}
                </button>
                {form.formState.errors.productId?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.productId.message}</p>
                )}
              </div>
            )}

            {!meter && (
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Initial meter reading</span>
                <Input
                  inputMode="decimal"
                  placeholder="0.000"
                  disabled={pending}
                  aria-invalid={Boolean(form.formState.errors.initialReading)}
                  {...form.register('initialReading')}
                />
                <span className="text-xs text-text-tertiary">This becomes the opening reading of the first report using this meter.</span>
                {form.formState.errors.initialReading?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.initialReading.message}</p>
                )}
              </label>
            )}

            {form.formState.errors.root?.message && (
              <p role="alert" className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}
          </div>
          <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <Button type="button" variant="outline" className="flex-1" disabled={pending} onClick={close}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={!form.formState.isValid || pending}>
              {pending && <Spinner className="size-4" />}
              {pending ? 'Saving…' : meter ? 'Save changes' : <><Plus aria-hidden="true" />Add meter</>}
            </Button>
          </footer>
        </form>
      </SetupSheet>

      {!meter && selectingProduct && (
        <ProductSelectSheet
          products={products}
          selectedId={selectedId}
          onSelect={(product) => {
            form.setValue('productId', product.id, { shouldValidate: true, shouldDirty: true })
            setSelectingProduct(false)
          }}
          onClose={() => setSelectingProduct(false)}
        />
      )}
    </>
  )
}

function formatPrice(value: string) {
  const [whole, fraction = ''] = value.split('.')
  return `${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`
}
