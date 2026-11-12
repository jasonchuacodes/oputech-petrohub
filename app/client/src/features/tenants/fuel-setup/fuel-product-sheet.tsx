import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useRef, useState, type RefObject } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import Decimal from 'decimal.js'
import { Button } from '~/components/ui/button'
import { DateTimePicker, formatDateTimeValue } from '~/components/ui/date-time-picker'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import type { FuelProductFieldsFragment } from '~/generated/graphql'
import { useChangeFuelPriceMutation, useCreateFuelProductMutation, useUpdateFuelProductMutation } from '../fuel-setup.queries'
import { fuelProductFormSchema, type FuelProductFormValues } from './fuel-setup.schema'
import { SetupSheet } from './setup-sheet'

type FuelProductSheetProps = {
  tenantId: string
  product?: FuelProductFieldsFragment
  mode?: 'full' | 'price'
  timezone?: string
  returnFocusRef?: RefObject<HTMLElement | null>
  onClose: () => void
}

export function FuelProductSheet({
  tenantId,
  product,
  mode = 'full',
  timezone,
  returnFocusRef,
  onClose,
}: FuelProductSheetProps) {
  const createProduct = useCreateFuelProductMutation(tenantId)
  const updateProduct = useUpdateFuelProductMutation(tenantId)
  const changeFuelPrice = useChangeFuelPriceMutation(tenantId)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const priceInputRef = useRef<HTMLInputElement>(null)
  const priceOnly = mode === 'price' && Boolean(product)
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [scheduledAt, setScheduledAt] = useState('')
  const form = useForm<FuelProductFormValues>({
    resolver: zodResolver(fuelProductFormSchema),
    defaultValues: product ? { name: product.name, unitPrice: product.unitPrice } : { name: '', unitPrice: '' },
    mode: 'onChange',
  })
  const nameField = form.register('name')
  const priceField = form.register('unitPrice')
  const unitPrice = useWatch({ control: form.control, name: 'unitPrice' })
  const pending = createProduct.isPending || updateProduct.isPending || changeFuelPrice.isPending
  const close = () => {
    if (!pending) onClose()
  }
  const submit = form.handleSubmit(async (values) => {
    try {
      if (product) {
        let expectedRevision = product.revision
        if (!priceOnly && values.name !== product.name) {
          await updateProduct.mutateAsync({
            productId: product.id,
            expectedRevision,
            name: values.name,
          })
          expectedRevision += 1
        }
        if (!new Decimal(values.unitPrice).equals(product.unitPrice)) {
          const effective = scheduleEnabled && scheduledAt
            ? parseEffectiveHour(scheduledAt)
            : currentEffectiveHour(timezone ?? 'UTC')
          await changeFuelPrice.mutateAsync({
            productId: product.id,
            expectedRevision,
            unitPrice: values.unitPrice,
            ...effective,
          })
        }
      } else {
        await createProduct.mutateAsync(values)
      }
      toast.success(priceOnly ? 'Fuel price updated' : product ? 'Fuel product updated' : 'Fuel product created')
      onClose()
    } catch {
      form.setError('root', { message: 'Unable to save the fuel product. Refresh and try again.' })
    }
  })

  return (
    <SetupSheet
      open
      title={priceOnly ? 'Product details' : product ? 'Edit fuel product' : 'Add fuel product'}
      description={priceOnly ? 'Update the price now or plan a future change.' : 'Set the product name and selling price used by new reports.'}
      onClose={close}
      escapeDisabled={pending}
      manageFocus
      initialFocusRef={priceOnly ? priceInputRef : nameInputRef}
      returnFocusRef={returnFocusRef}
    >
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5">
          {priceOnly && product?.nextPriceChange && (
            <div className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2.5 text-sm">
              <p className="font-medium text-text-heading">Scheduled price change</p>
              <p className="mt-1 text-text-secondary">
                ₱{formatPrice(product.nextPriceChange.unitPrice)} effective{' '}
                <span className="font-medium text-text-heading">
                  {formatEffectiveHour(product.nextPriceChange.effectiveDate, product.nextPriceChange.effectiveHour)}
                </span>
              </p>
            </div>
          )}
          {priceOnly && scheduledAt && (
            <div className="flex items-center gap-3 rounded-md border border-status-warning/25 bg-status-warning/10 px-3 py-2.5 text-sm text-text-secondary">
              <p className="min-w-0 flex-1">
                Price update to{' '}
                <span className="font-medium text-text-heading">₱{unitPrice || '0.00'}</span> on{' '}
                <span className="font-medium text-text-heading">{formatDateTimeValue(scheduledAt, true)}</span>
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="-mr-2 size-9 shrink-0 text-status-warning hover:text-status-warning"
                aria-label="Cancel scheduled price change"
                onClick={() => {
                  setScheduleEnabled(false)
                  setScheduledAt('')
                  form.clearErrors('root')
                }}
              >
                <X aria-hidden="true" />
              </Button>
            </div>
          )}
          {priceOnly ? (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Product name</span>
              <Input value={product?.name ?? ''} readOnly aria-readonly="true" className="bg-muted text-text-secondary" />
            </label>
          ) : (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Product name</span>
              <Input
                {...nameField}
                ref={(element) => {
                  nameField.ref(element)
                  nameInputRef.current = element
                }}
                placeholder="ADO"
                disabled={pending}
                aria-invalid={Boolean(form.formState.errors.name)}
              />
              {form.formState.errors.name?.message && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </label>
          )}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Unit price</span>
            <Input
              {...priceField}
              ref={(element) => {
                priceField.ref(element)
                priceInputRef.current = element
              }}
              inputMode="decimal"
              placeholder="0.00"
              disabled={pending}
              aria-invalid={Boolean(form.formState.errors.unitPrice)}
            />
            {form.formState.errors.unitPrice?.message && (
              <p className="text-sm text-destructive">{form.formState.errors.unitPrice.message}</p>
            )}
          </label>
          {priceOnly && (
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={scheduleEnabled}
                  className="size-5 shrink-0 accent-primary"
                  onChange={(event) => {
                    setScheduleEnabled(event.target.checked)
                    form.clearErrors('root')
                    if (!event.target.checked) setScheduledAt('')
                  }}
                />
                <span className="text-sm font-medium text-text-heading">Scheduled price change</span>
              </label>
              {scheduleEnabled && (
                <DateTimePicker
                  value={scheduledAt}
                  timezone={timezone ?? 'UTC'}
                  hourOnly
                  disabled={pending}
                  onChange={(value) => {
                    setScheduledAt(value)
                    form.clearErrors('root')
                  }}
                />
              )}
            </div>
          )}
          {form.formState.errors.root?.message && (
            <p role="alert" className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          )}
        </div>
        <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button type="button" variant="outline" className="flex-1" disabled={pending} onClick={close}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!form.formState.isValid || pending || (scheduleEnabled && !scheduledAt)}
          >
            {pending && <Spinner className="size-4" />}
            {pending ? 'Saving…' : scheduleEnabled ? 'Save price change' : product ? 'Save changes' : 'Add product'}
          </Button>
        </footer>
      </form>
    </SetupSheet>
  )
}

function parseEffectiveHour(value: string): { effectiveDate: string; effectiveHour: number } {
  const [effectiveDate = '', time = ''] = value.split('T')
  return { effectiveDate, effectiveHour: Number(time.slice(0, 2)) }
}

function currentEffectiveHour(timezone: string): { effectiveDate: string; effectiveHour: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return {
    effectiveDate: `${values.year}-${values.month}-${values.day}`,
    effectiveHour: Number(values.hour),
  }
}

function formatEffectiveHour(effectiveDate: string, effectiveHour: number): string {
  return formatDateTimeValue(
    `${effectiveDate}T${String(effectiveHour).padStart(2, '0')}:00`,
    true,
  )
}

function formatPrice(value: string): string {
  const [whole, fraction = ''] = value.split('.')
  return `${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`
}
