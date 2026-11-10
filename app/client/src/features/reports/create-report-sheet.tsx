'use client'

import { CalendarDays, CircleAlert, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '~/components/ui/button'
import { Spinner } from '~/components/ui/spinner'
import { cn } from '~/utils/cn'
import { useActiveTenant } from '../layout/use-active-tenant'
import { useCreateReportMutation, useReportCreationContextQuery } from './reports.queries'

type CreateReportSheetProps = { onClose: () => void; onOpenReport: (reportId: string) => void }
const focusableSelector = 'button:not([disabled]),input:not([disabled]),[href],[tabindex]:not([tabindex="-1"])'

export function CreateReportSheet({ onClose, onOpenReport }: CreateReportSheetProps) {
  const { tenant } = useActiveTenant()
  const context = useReportCreationContextQuery(tenant.id)
  const createReport = useCreateReportMutation(tenant.id)
  const [selectedShiftId, setSelectedShiftId] = useState<string>()
  const [error, setError] = useState<string>()
  const dialogRef = useRef<HTMLFormElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape' && !createReport.isPending) {
      event.preventDefault()
      onClose()
    }
    if (event.key !== 'Tab') return
    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])
    if (!focusable.length) return
    if (event.shiftKey && document.activeElement === focusable[0]) {
      event.preventDefault(); focusable.at(-1)?.focus()
    } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
      event.preventDefault(); focusable[0]?.focus()
    }
  }

  const effectiveShiftId =
    selectedShiftId ?? context.data?.slots.find((slot) => slot.report || slot.canCreate)?.shift.id
  const selected = context.data?.slots.find((slot) => slot.shift.id === effectiveShiftId)
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (
      !selected ||
      !context.data ||
      createReport.isPending ||
      (!selected.report && !selected.canCreate)
    ) return
    if (selected.report) {
      onOpenReport(selected.report.id)
      return
    }
    setError(undefined)
    try {
      const result = await createReport.mutateAsync({ shiftId: selected.shift.id, businessDate: context.data.businessDate })
      onOpenReport(result.report.id)
    } catch {
      setError('Unable to create the report. Refresh and try again.')
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center wide:items-center wide:p-6">
      <button type="button" aria-label="Close create shift report sheet" tabIndex={-1} className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" disabled={createReport.isPending} onClick={onClose} />
      <form ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} className="relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-sheet bg-card shadow-2xl wide:max-w-xl wide:rounded-lg" noValidate onKeyDown={handleKeyDown} onSubmit={submit}>
        <div aria-hidden="true" className="mx-auto mt-3 h-1.5 w-14 shrink-0 rounded-full bg-foreground/35 wide:hidden" />
        <header className="flex shrink-0 items-start gap-3 p-5 pb-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-brand text-white"><CalendarDays aria-hidden="true" className="size-5" /></span>
          <div className="min-w-0 flex-1"><h2 id={titleId} className="text-lg font-semibold text-text-heading">Create shift report</h2><p id={descriptionId} className="mt-0.5 text-sm text-text-secondary">Choose a configured shift to create or open its report.</p></div>
          <Button type="button" variant="ghost" size="icon" aria-label="Close create shift report sheet" className="-mr-2 -mt-1 text-text-secondary" disabled={createReport.isPending} onClick={onClose}><X aria-hidden="true" /></Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
          {context.isPending ? <div className="flex min-h-48 items-center justify-center"><Spinner className="size-6" /></div> : context.isError ? <p role="alert" className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">Unable to load tenant shifts.</p> : (
            <>
              <div className="mb-3 flex min-h-11 items-center gap-3 rounded-sm border border-input px-3"><CalendarDays aria-hidden="true" className="size-5 text-text-secondary" /><span>{formatBusinessDate(context.data.businessDate)}</span></div>
              {context.data.slots.length === 0 ? <p className="rounded-md border border-dashed p-5 text-center text-sm text-text-secondary">No shifts are configured. Ask an administrator to add one.</p> : <fieldset className="flex flex-col gap-2"><legend className="sr-only">Shift</legend>{context.data.slots.map((slot) => {
                const selectedSlot = slot.shift.id === effectiveShiftId
                const blocked = !slot.report && !slot.canCreate
                return <label key={slot.shift.id} className={cn('flex min-h-20 items-center gap-3 rounded-md border p-3', selectedSlot ? 'border-primary bg-accent' : 'border-border', blocked && 'cursor-not-allowed opacity-60')}>
                  <input type="radio" name="report-shift" checked={selectedSlot} disabled={blocked} className="size-5 accent-primary" onChange={() => setSelectedShiftId(slot.shift.id)} />
                  <span className="min-w-0 flex-1"><span className="block font-medium text-text-heading">{formatShiftTime(slot.shift)}</span><span className={cn('mt-1 inline-flex rounded-sm px-2 py-0.5 text-xs font-medium', slot.report?.status === 'submitted' ? 'bg-status-success/12 text-status-success' : slot.report ? 'bg-status-warning/12 text-status-warning' : blocked ? 'bg-muted text-text-tertiary' : 'bg-primary/10 text-primary')}>{slot.report ? slot.report.status === 'submitted' ? 'Submitted' : 'Draft' : slot.blockedReason ?? 'Available'}</span></span>
                </label>
              })}</fieldset>}
              <p className="mt-3 flex gap-2 text-sm text-text-secondary"><CircleAlert aria-hidden="true" className="mt-0.5 size-4" />Reports are visible to users in this tenant.</p>
            </>
          )}
          {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
        </div>
        <footer className="border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"><Button type="submit" size="lg" className="w-full" disabled={!selected || (!selected.report && !selected.canCreate) || context.isPending || createReport.isPending}>{createReport.isPending && <Spinner className="size-4" />}{createReport.isPending ? 'Creating…' : selected?.report ? 'Open report' : selected ? `Create ${formatShiftTime(selected.shift)} report` : 'Select a shift'}</Button></footer>
      </form>
    </div>, document.body,
  )
}

export function formatBusinessDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(year, month - 1, day))
}

export function formatShiftTime(shift: { startTime: string; endTime: string }): string {
  return `${shift.startTime}–${shift.endTime}`
}
