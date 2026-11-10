'use client'

import { CalendarDays, CircleAlert, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '~/components/ui/button'
import { cn } from '~/utils/cn'
import {
  reportPreviewDate,
  reportShiftPreviews,
  type ReportPreviewId,
  type ReportShiftId,
} from './report-preview-data'

type CreateReportSheetProps = {
  onClose: () => void
  onOpenReport: (reportId: ReportPreviewId) => void
}

const focusableSelector = [
  'button:not([disabled])',
  'input:not([disabled])',
  '[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function CreateReportSheet({ onClose, onOpenReport }: CreateReportSheetProps) {
  const firstAvailableShift = reportShiftPreviews.find((shift) => shift.state === 'available')
  const [selectedShiftId, setSelectedShiftId] = useState<ReportShiftId | undefined>(
    firstAvailableShift?.id,
  )
  const dialogRef = useRef<HTMLFormElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const originalOverflow = document.body.style.overflow
    const selectedRadio = dialogRef.current?.querySelector<HTMLInputElement>(
      'input[name="report-shift"]:checked',
    )

    document.body.style.overflow = 'hidden'
    selectedRadio?.focus()

    return () => {
      document.body.style.overflow = originalOverflow
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [])

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }

    if (event.key !== 'Tab') return

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    ).filter((element) => element.getAttribute('aria-hidden') !== 'true')

    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const selectedShift = reportShiftPreviews.find((shift) => shift.id === selectedShiftId)
    if (!selectedShift || selectedShift.state !== 'available') return
    onOpenReport(selectedShift.previewReportId)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
      <button
        type="button"
        aria-label="Close create shift report sheet"
        tabIndex={-1}
        className="absolute inset-0 bg-foreground/55 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-sheet bg-card shadow-2xl md:max-w-xl md:rounded-sheet"
        onKeyDown={handleDialogKeyDown}
        onSubmit={submit}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-3 h-1.5 w-14 shrink-0 rounded-full bg-foreground/30 md:hidden"
        />

        <header className="flex shrink-0 items-start gap-3 px-5 pt-4 pb-3">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-lg font-semibold text-text-heading">
              Create shift report
            </h2>
            <p id={descriptionId} className="mt-0.5 text-sm text-text-secondary">
              Choose an available shift to open its report workspace.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close create shift report sheet"
            className="-mr-2 -mt-1 wide:size-11"
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
          <div className="mb-3 flex min-h-11 items-center gap-3 rounded-sm border border-input px-3">
            <CalendarDays aria-hidden="true" className="size-5 shrink-0 text-text-secondary" />
            <span className="text-base">{reportPreviewDate.label}</span>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="sr-only">Shift</legend>
            {reportShiftPreviews.map((shift) => {
              const selected = shift.id === selectedShiftId
              const unavailable = shift.state === 'submitted'

              return (
                <div
                  key={shift.id}
                  className={cn(
                    'flex min-h-20 items-center gap-3 rounded-md border p-3 transition-colors',
                    selected ? 'border-primary bg-accent' : 'border-border bg-card',
                  )}
                >
                  <input
                    id={`report-shift-${shift.id}`}
                    type="radio"
                    name="report-shift"
                    value={shift.id}
                    checked={selected}
                    disabled={unavailable}
                    className="size-5 shrink-0 accent-primary"
                    onChange={() => setSelectedShiftId(shift.id)}
                  />
                  <label htmlFor={`report-shift-${shift.id}`} className="min-w-0 flex-1">
                    <span className="block font-medium text-text-heading">{shift.ordinal}</span>
                    <span className="block text-sm text-text-secondary">{shift.time}</span>
                    {shift.state === 'submitted' ? (
                      <span className="mt-1 inline-flex rounded-sm bg-status-success/12 px-2 py-0.5 text-xs font-medium text-status-success">
                        Submitted · {shift.submittedBy}
                      </span>
                    ) : (
                      <span className="mt-1 inline-flex rounded-sm bg-status-success/12 px-2 py-0.5 text-xs font-medium text-status-success">
                        Available
                      </span>
                    )}
                  </label>
                  {unavailable && (
                    <Button type="button" variant="ghost" disabled aria-label="Submitted report unavailable">
                      View
                    </Button>
                  )}
                </div>
              )
            })}
          </fieldset>

          <p className="mt-3 flex gap-2 text-sm text-text-secondary">
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            Only you can edit the report you create.
          </p>
        </div>

        <footer className="shrink-0 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button type="submit" size="lg" className="w-full wide:h-12" disabled={!selectedShiftId}>
            Create 2nd shift report
          </Button>
        </footer>
      </form>
    </div>,
    document.body,
  )
}
