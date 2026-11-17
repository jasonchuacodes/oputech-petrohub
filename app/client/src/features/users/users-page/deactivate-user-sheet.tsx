import { zodResolver } from '@hookform/resolvers/zod'
import { UserX } from 'lucide-react'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Sheet } from '~/components/ui/sheet'
import { Spinner } from '~/components/ui/spinner'
import { Textarea } from '~/components/ui/textarea'
import { useDeactivateUserMutation, type UserSummary } from '../users.queries'
import {
  deactivateUserFormSchema,
  type DeactivateUserFormValues,
} from './user-form.schema'

type DeactivateUserSheetProps = {
  open: boolean
  tenantId: string
  timezone: string
  user: UserSummary
  onClose: () => void
}

export function DeactivateUserSheet({
  open,
  tenantId,
  timezone,
  user,
  onClose,
}: DeactivateUserSheetProps) {
  const deactivateUser = useDeactivateUserMutation()
  const today = localDate(timezone)
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm<DeactivateUserFormValues>({
    defaultValues: { reason: 'resign', details: '', effectiveDate: today },
    mode: 'onChange',
    resolver: zodResolver(deactivateUserFormSchema),
  })
  const reason = useWatch({ control, name: 'reason' })
  const effectiveDate = useWatch({ control, name: 'effectiveDate' })
  const isScheduled = effectiveDate > today

  useEffect(() => {
    if (open) reset({ reason: 'resign', details: '', effectiveDate: today })
  }, [open, reset, today])

  const close = () => {
    if (!deactivateUser.isPending) onClose()
  }
  const submit = handleSubmit(async (values) => {
    try {
      await deactivateUser.mutateAsync({
        tenantId,
        input: {
          userId: user.id,
          reason: values.reason,
          details: values.details || null,
          effectiveDate: values.effectiveDate,
        },
      })
      onClose()
      toast.success(values.effectiveDate > today ? 'Deactivation scheduled' : 'User deactivated')
    } catch {
      setError('root', { message: 'Unable to deactivate the user. Reload and try again.' })
    }
  })

  return (
    <Sheet
      open={open}
      title={isScheduled ? 'Schedule deactivation' : 'Deactivate user'}
      description={`${user.fullName} will lose access to this tenant only.`}
      icon={UserX}
      variant="danger"
      escapeDisabled={deactivateUser.isPending}
      manageFocus
      onClose={close}
    >
      <form className="flex min-h-0 flex-col" noValidate onSubmit={submit}>
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto px-5 pb-5">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Reason
            <select
              className="h-11 rounded-sm border border-input bg-card px-3 text-base outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/10 wide:text-sm"
              disabled={deactivateUser.isPending}
              {...register('reason')}
            >
              <option value="resign">Resigned</option>
              <option value="terminated">Terminated</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Effective date
            <Input
              type="date"
              disabled={deactivateUser.isPending}
              aria-invalid={Boolean(errors.effectiveDate)}
              {...register('effectiveDate')}
            />
            <span className="text-xs font-normal text-text-tertiary">
              Future dates take effect at 12:00 AM in {timezone}. Today or past dates remove access
              immediately.
            </span>
            {errors.effectiveDate?.message && (
              <span role="alert" className="text-sm font-normal text-destructive">
                {errors.effectiveDate.message}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Details{reason === 'other' ? ' *' : ''}
            <Textarea
              maxLength={500}
              placeholder={reason === 'other' ? 'Describe the reason' : 'Optional note'}
              disabled={deactivateUser.isPending}
              aria-invalid={Boolean(errors.details)}
              {...register('details')}
            />
            {errors.details?.message && (
              <span role="alert" className="text-sm font-normal text-destructive">
                {errors.details.message}
              </span>
            )}
          </label>

          <p className="rounded-md bg-muted p-3 text-sm text-text-secondary">
            This cannot be edited, cancelled, or reactivated. Attendance and historical records will
            be retained.
          </p>
          {errors.root?.message && (
            <p role="alert" className="text-sm text-destructive">
              {errors.root.message}
            </p>
          )}
        </div>

        <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={deactivateUser.isPending}
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            className="flex-1"
            disabled={!isValid || deactivateUser.isPending}
          >
            {deactivateUser.isPending && <Spinner className="size-4" />}
            {isScheduled ? 'Schedule' : 'Deactivate'}
          </Button>
        </footer>
      </form>
    </Sheet>
  )
}

function localDate(timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}
