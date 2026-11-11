import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronRight, Gauge, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import type { FuelProductFieldsFragment } from '~/generated/graphql'
import { useCreatePumpMeterMutation } from '../fuel-setup.queries'
import { pumpMeterFormSchema, type PumpMeterFormValues } from './fuel-setup.schema'
import { ProductSelectSheet } from './product-select-sheet'
import { SetupSheet } from './setup-sheet'

export function PumpMeterSheet({ tenantId, products, onClose }: { tenantId: string; products: FuelProductFieldsFragment[]; onClose: () => void }) {
  const activeProducts = products.filter((product) => product.status === 'active')
  const createMeter = useCreatePumpMeterMutation(tenantId)
  const [selectingProduct, setSelectingProduct] = useState(false)
  const form = useForm<PumpMeterFormValues>({ resolver: zodResolver(pumpMeterFormSchema), defaultValues: { label: '', productId: activeProducts[0]?.id ?? '', initialReading: '0.000' }, mode: 'onChange' })
  const selectedId = useWatch({ control: form.control, name: 'productId' })
  const selectedProduct = products.find((product) => product.id === selectedId)
  const submit = form.handleSubmit(async (values) => {
    try {
      await createMeter.mutateAsync(values)
      toast.success('Pump meter created')
      onClose()
    } catch {
      form.setError('root', { message: 'Unable to create the pump meter. Refresh and try again.' })
    }
  })

  return <><SetupSheet open escapeDisabled={selectingProduct} title="Add pump meter" description="Create one entry for each independently incrementing physical meter." onClose={onClose}><form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}><div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5"><label className="flex flex-col gap-1.5"><span className="text-sm font-medium">Meter label</span><Input autoFocus placeholder="ADO 1" disabled={createMeter.isPending} aria-invalid={Boolean(form.formState.errors.label)} {...form.register('label')} />{form.formState.errors.label?.message && <p className="text-sm text-destructive">{form.formState.errors.label.message}</p>}</label><div className="flex flex-col gap-1.5"><span className="text-sm font-medium">Fuel product</span><button type="button" className="flex min-h-11 items-center gap-3 rounded-sm border border-input px-3 text-left outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/10" onClick={() => setSelectingProduct(true)}><Gauge aria-hidden="true" className="size-4 text-primary" /><span className="min-w-0 flex-1">{selectedProduct ? <><span className="block font-medium">{selectedProduct.name}</span><span className="block text-xs text-text-tertiary">₱{formatPrice(selectedProduct.unitPrice)}</span></> : <span className="text-text-tertiary">Select fuel product</span>}</span>{selectedProduct ? <Check aria-hidden="true" className="size-4 text-status-success" /> : <ChevronRight aria-hidden="true" className="size-4 text-text-tertiary" />}</button>{form.formState.errors.productId?.message && <p className="text-sm text-destructive">{form.formState.errors.productId.message}</p>}</div><label className="flex flex-col gap-1.5"><span className="text-sm font-medium">Initial meter reading</span><Input inputMode="decimal" placeholder="0.000" disabled={createMeter.isPending} aria-invalid={Boolean(form.formState.errors.initialReading)} {...form.register('initialReading')} /><span className="text-xs text-text-tertiary">This becomes the opening reading of the first report using this meter.</span>{form.formState.errors.initialReading?.message && <p className="text-sm text-destructive">{form.formState.errors.initialReading.message}</p>}</label>{form.formState.errors.root?.message && <p role="alert" className="text-sm text-destructive">{form.formState.errors.root.message}</p>}</div><footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"><Button type="button" variant="outline" className="flex-1" disabled={createMeter.isPending} onClick={onClose}>Cancel</Button><Button type="submit" className="flex-1" disabled={!form.formState.isValid || createMeter.isPending}>{createMeter.isPending ? <Spinner className="size-4" /> : <Plus aria-hidden="true" />}{createMeter.isPending ? 'Creating…' : 'Add meter'}</Button></footer></form></SetupSheet>{selectingProduct && <ProductSelectSheet products={products} selectedId={selectedId} onSelect={(product) => { form.setValue('productId', product.id, { shouldDirty: true, shouldValidate: true }); setSelectingProduct(false) }} onClose={() => setSelectingProduct(false)} />}</>
}

function formatPrice(value: string) { const [whole, fraction = ''] = value.split('.'); return `${whole}.${fraction.padEnd(2, '0').slice(0, 2)}` }
