'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Sheet } from '~/components/ui/sheet'
import {
  addIncomeFieldFormSchema,
  type AddIncomeFieldFormValues,
} from './income-setup.schema'

type IncomeFieldSheetProps = {
  open: boolean
  existingDescriptions: string[]
  onAdd: (description: string) => Promise<boolean>
  onClose: () => void
}

export function IncomeFieldSheet({
  open,
  existingDescriptions,
  onAdd,
  onClose,
}: IncomeFieldSheetProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<AddIncomeFieldFormValues>({
    resolver: zodResolver(addIncomeFieldFormSchema),
    defaultValues: { description: '' },
    mode: 'onChange',
  })
  const descriptionField = form.register('description')
  const close = () => {
    if (submitting) return
    form.reset()
    onClose()
  }
  const submit = form.handleSubmit(async (values) => {
    const duplicate = existingDescriptions.some(
      (description) => description.toLocaleLowerCase() === values.description.toLocaleLowerCase(),
    )
    if (duplicate) {
      form.setError('description', { message: 'A field with this name already exists' })
      return
    }
    setSubmitting(true)
    const added = await onAdd(values.description)
    setSubmitting(false)
    if (added) {
      form.reset()
      onClose()
    } else {
      form.setError('root', { message: 'Unable to add the field. Please try again.' })
    }
  })

  return (
    <Sheet
      open={open}
      title="Add recurring income field"
      description="This field will start at zero in new reports."
      manageFocus
      initialFocusRef={inputRef}
      escapeDisabled={submitting}
      onClose={close}
    >
      <form noValidate onSubmit={(event) => void submit(event)}>
        <div className="px-5 pb-5">
          <label htmlFor="recurring-income-description" className="text-sm font-medium">
            Field name
          </label>
          <Input
            id="recurring-income-description"
            className="mt-1.5"
            maxLength={120}
            placeholder="e.g. PayMaya"
            aria-invalid={Boolean(form.formState.errors.description)}
            aria-describedby={
              form.formState.errors.description ? 'recurring-income-description-error' : undefined
            }
            {...descriptionField}
            ref={(node) => {
              descriptionField.ref(node)
              inputRef.current = node
            }}
          />
          {form.formState.errors.description?.message && (
            <p id="recurring-income-description-error" role="alert" className="mt-1.5 text-sm text-destructive">
              {form.formState.errors.description.message}
            </p>
          )}
          {form.formState.errors.root?.message && (
            <p role="alert" className="mt-1.5 text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
        </div>
        <footer className="flex gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button type="button" variant="outline" className="flex-1" disabled={submitting} onClick={close}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={!form.formState.isValid || submitting}>
            {submitting ? 'Adding…' : 'Add field'}
          </Button>
        </footer>
      </form>
    </Sheet>
  )
}
