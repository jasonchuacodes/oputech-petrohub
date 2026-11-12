import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import {
  type ShiftRecord,
  useCreateShiftMutation,
  useDeleteShiftMutation,
  useUpdateShiftMutation,
} from '../tenants.queries'
import { addShiftFormSchema, type AddShiftFormValues } from './shift-form.schema'

type ShiftSheetProps = {
  open: boolean
  tenantId: string
  tenantName: string
  shift?: ShiftRecord
  onClose: () => void
}

const defaultValues: AddShiftFormValues = { name: '', startTime: '05:00', endTime: '13:00' }
const focusableSelector =
  'button:not([disabled]),input:not([disabled]),[href],[tabindex]:not([tabindex="-1"])'

export function ShiftSheet({ open, tenantId, tenantName, shift, onClose }: ShiftSheetProps) {
  const createShift = useCreateShiftMutation(tenantId)
  const updateShift = useUpdateShiftMutation(tenantId)
  const deleteShift = useDeleteShiftMutation(tenantId)
  const [view, setView] = useState<'actions' | 'edit'>(shift ? 'actions' : 'edit')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string>()
  const dialogRef = useRef<HTMLFormElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm<AddShiftFormValues>({
    defaultValues: shift
      ? { name: shift.name, startTime: shift.startTime, endTime: shift.endTime }
      : defaultValues,
    mode: 'onChange',
    resolver: zodResolver(addShiftFormSchema),
  })

  const isPending = createShift.isPending || updateShift.isPending || deleteShift.isPending
  const editing = view === 'edit'
  const close = useCallback(() => {
    if (isPending) return
    reset(defaultValues)
    onClose()
  }, [isPending, onClose, reset])

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [open])

  if (!open) return null

  const submit = handleSubmit(async (values) => {
    try {
      if (shift) {
        await updateShift.mutateAsync({ shiftId: shift.id, ...values })
      } else {
        await createShift.mutateAsync(values)
      }
      reset(defaultValues)
      onClose()
      toast.success(shift ? 'Shift updated successfully' : 'Shift created successfully')
    } catch {
      setError('root', {
        message: `Unable to ${shift ? 'update' : 'create'} the shift. Check that its name is unique and its times do not overlap another shift.`,
      })
    }
  })

  const remove = async () => {
    if (!shift) return
    setDeleteError(undefined)
    try {
      await deleteShift.mutateAsync(shift.id)
      setDeleteOpen(false)
      onClose()
      toast.success('Shift deleted successfully')
    } catch {
      setDeleteError('Unable to delete the shift. Please try again.')
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape' && !isPending) {
      event.preventDefault()
      close()
    }
    if (event.key !== 'Tab') return
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    )
    if (!focusable.length) return
    if (event.shiftKey && document.activeElement === focusable[0]) {
      event.preventDefault()
      focusable.at(-1)?.focus()
    } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
      event.preventDefault()
      focusable[0]?.focus()
    }
  }

  return (
    <>
      {createPortal(
        <div
      aria-hidden={deleteOpen || undefined}
      className={`fixed inset-0 z-50 flex items-end justify-center wide:items-center wide:p-6${deleteOpen ? ' invisible pointer-events-none' : ''}`}
    >
      <button
        type="button"
        aria-label={`Close ${shift && !editing ? 'shift actions' : shift ? 'Edit' : 'Add'} shift sheet`}
        tabIndex={-1}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        disabled={isPending}
        onClick={close}
      />
      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-sheet bg-card shadow-2xl wide:max-w-xl wide:rounded-lg"
        noValidate
        onKeyDown={handleKeyDown}
        onSubmit={submit}
      >
        <div aria-hidden="true" className="mx-auto mt-3 h-1.5 w-14 shrink-0 rounded-full bg-foreground/35 wide:hidden" />

        <header className="flex shrink-0 items-start gap-3 p-5 pb-4">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-xl font-semibold text-text-heading">
              {shift ? (editing ? 'Edit shift' : 'Shift actions') : 'Add shift'}
            </h2>
            <p id={descriptionId} className="mt-0.5 text-sm text-text-secondary">
              {shift && !editing
                ? `${shift.name} · ${shift.startTime}–${shift.endTime}`
                : `${shift ? 'Update' : 'Add'} a daily shift for ${tenantName}.`}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Close ${shift && !editing ? 'shift actions' : shift ? 'Edit' : 'Add'} shift`}
            className="-mr-2 -mt-1 text-text-secondary"
            disabled={isPending}
            onClick={close}
          >
            <X aria-hidden="true" />
          </Button>
        </header>

        {editing ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
            <div className="mb-4 flex flex-col gap-1.5">
              <label htmlFor="shift-name" className="text-sm font-medium">Shift name</label>
              <Input
                id="shift-name"
                autoFocus
                placeholder="Morning"
                disabled={isPending}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'shift-name-error' : undefined}
                {...register('name')}
              />
              {errors.name?.message && <p id="shift-name-error" role="alert" className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="new-shift-start" className="text-sm font-medium">Start time</label>
                <Input
                  id="new-shift-start"
                  type="time"
                  disabled={isPending}
                  aria-invalid={Boolean(errors.startTime)}
                  aria-describedby={errors.startTime ? 'new-shift-start-error' : undefined}
                  {...register('startTime')}
                />
                {errors.startTime?.message && <p id="new-shift-start-error" role="alert" className="text-sm text-destructive">{errors.startTime.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="new-shift-end" className="text-sm font-medium">End time</label>
                <Input
                  id="new-shift-end"
                  type="time"
                  disabled={isPending}
                  aria-invalid={Boolean(errors.endTime)}
                  aria-describedby={errors.endTime ? 'new-shift-end-error' : undefined}
                  {...register('endTime')}
                />
                {errors.endTime?.message && <p id="new-shift-end-error" role="alert" className="text-sm text-destructive">{errors.endTime.message}</p>}
              </div>
            </div>
            <p className="mt-3 text-sm text-text-tertiary">Shifts cannot overlap.</p>
            {errors.root?.message && <p role="alert" className="mt-3 text-sm text-destructive">{errors.root.message}</p>}
          </div>
        ) : (
          <div className="flex min-h-0 flex-col gap-2 overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <Button type="button" variant="outline" className="w-full" onClick={() => setView('edit')}>
              <Pencil aria-hidden="true" />
              Edit shift
            </Button>
            <Button type="button" variant="destructive" className="w-full" onClick={() => setDeleteOpen(true)}>
              <Trash2 aria-hidden="true" />
              Delete shift
            </Button>
          </div>
        )}

        {editing && (
          <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <Button type="button" variant="outline" className="flex-1" disabled={isPending} onClick={close}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={!isValid || isPending}>
              {(createShift.isPending || updateShift.isPending) && <Spinner className="size-4" />}
              {createShift.isPending ? 'Creating…' : updateShift.isPending ? 'Saving…' : shift ? 'Save' : 'Create shift'}
            </Button>
          </footer>
        )}
      </form>
        </div>,
        document.body,
      )}
      {shift && (
        <ConfirmationDialog
          open={deleteOpen}
          title="Delete shift?"
          description={`${shift.name} · ${shift.startTime}–${shift.endTime} will be removed from the tenant schedule.`}
          icon={Trash2}
          variant="danger"
          confirmText="Delete shift"
          loading={deleteShift.isPending}
          onClose={() => {
            if (!deleteShift.isPending) {
              setDeleteOpen(false)
              setDeleteError(undefined)
            }
          }}
          onConfirm={() => void remove()}
        >
          <p className="text-sm text-text-secondary">
            Existing reports keep their saved shift interval.
          </p>
          {deleteError && <p role="alert" className="mt-3 text-sm text-destructive">{deleteError}</p>}
        </ConfirmationDialog>
      )}
    </>
  )
}
