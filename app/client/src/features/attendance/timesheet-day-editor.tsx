'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog'
import { NumberInput } from '~/components/ui/number-input'
import { Sheet } from '~/components/ui/sheet'
import { Spinner } from '~/components/ui/spinner'
import type { TimesheetDayFieldsFragment } from '~/generated/graphql'
import { useMediaQuery } from '~/hooks/useMediaQuery'
import { useSetTimesheetDayOverrideMutation } from './attendance.queries'
import { formatTimesheetDate, formatTimesheetTime } from './attendance.utils'

const tabletMediaQuery = '(min-width: 48rem)'
const overrideSchema = z.object({
  hours: z.number({ error: 'Enter logged hours' }).min(0, 'Hours cannot be negative'),
})
type OverrideForm = z.infer<typeof overrideSchema>

export function TimesheetDayEditor({
  tenantId,
  userId,
  memberName,
  timezone,
  day,
  onClose,
}: {
  tenantId: string
  userId: string
  memberName: string
  timezone: string
  day: TimesheetDayFieldsFragment
  onClose: () => void
}) {
  const tablet = useMediaQuery(tabletMediaQuery)
  const formId = useId()
  const mutation = useSetTimesheetDayOverrideMutation(tenantId)
  const form = useForm<OverrideForm>({
    resolver: zodResolver(overrideSchema),
    mode: 'onChange',
    defaultValues: { hours: Number(day.effectiveHours) },
  })

  const close = () => {
    if (!mutation.isPending) onClose()
  }
  const save = form.handleSubmit(async ({ hours }) => {
    try {
      await mutation.mutateAsync({
        userId,
        localDate: day.localDate,
        overrideHours: hours.toFixed(2),
        expectedRevision: day.revision,
      })
      toast.success('Timesheet hours saved')
      onClose()
    } catch {
      form.setError('root', {
        message: 'Unable to save. Reload if another administrator changed this day.',
      })
    }
  })

  const fields = (
    <form id={formId} onSubmit={save}>
      <dl className="grid grid-cols-2 gap-3 rounded-md bg-muted/60 p-3 text-sm">
        <div>
          <dt className="text-text-tertiary">Check-in</dt>
          <dd className="mt-0.5 font-medium text-text-heading tabular-nums">
            {formatTimesheetTime(day.checkInAt, timezone)}
          </dd>
        </div>
        <div>
          <dt className="text-text-tertiary">Check-out</dt>
          <dd className="mt-0.5 font-medium text-text-heading tabular-nums">
            {formatTimesheetTime(day.checkOutAt, timezone)}
          </dd>
        </div>
      </dl>

      <label className="mt-4 flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text-heading">Logged hours</span>
        <NumberInput
          autoFocus
          control={form.control}
          name="hours"
          step={0.01}
          min={0}
          disabled={mutation.isPending}
        />
      </label>
      {form.formState.errors.root?.message && (
        <p className="mt-2 text-sm text-destructive">{form.formState.errors.root.message}</p>
      )}
    </form>
  )

  if (tablet) {
    return (
      <ConfirmationDialog
        open
        title="Edit timesheet"
        description={`${memberName} · ${formatTimesheetDate(day.localDate)}`}
        confirmText="Save"
        cancelText="Cancel"
        disabled={!form.formState.isValid}
        loading={mutation.isPending}
        onClose={close}
        onConfirm={() => void save()}
      >
        {fields}
      </ConfirmationDialog>
    )
  }

  return (
    <Sheet
      open
      title="Edit timesheet"
      description={`${memberName} · ${formatTimesheetDate(day.localDate)}`}
      manageFocus
      escapeDisabled={mutation.isPending}
      onClose={close}
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{fields}</div>
      <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          disabled={mutation.isPending}
          onClick={close}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form={formId}
          size="lg"
          className="flex-1"
          disabled={!form.formState.isValid || mutation.isPending}
        >
          {mutation.isPending && <Spinner className="size-4" />}
          Save
        </Button>
      </footer>
    </Sheet>
  )
}
