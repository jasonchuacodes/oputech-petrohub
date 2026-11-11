'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Sheet } from '~/components/ui/sheet'

type DateRangePickerProps = {
  startDate: string
  endDate: string
  timezone: string
  maxDate?: string
  disabled?: boolean
  onApply: (startDate: string, endDate: string) => void
}

export function DateRangePicker({
  startDate,
  endDate,
  timezone,
  maxDate,
  disabled,
  onApply,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        disabled={disabled || !startDate || !endDate}
        className="flex min-h-11 items-center gap-2 rounded-sm px-1 text-right whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50"
        onClick={() => setOpen(true)}
      >
        <span className="text-xs text-text-tertiary">Period</span>
        <span className="text-sm font-medium text-text-heading tabular-nums">
          {formatIndicatorDate(startDate)} - {formatIndicatorDate(endDate)}
        </span>
        <ChevronDown aria-hidden="true" className="size-4 text-text-secondary" />
      </button>

      {open && (
        <DateRangeSheet
          key={`${startDate}:${endDate}`}
          startDate={startDate}
          endDate={endDate}
          timezone={timezone}
          maxDate={maxDate}
          onClose={() => setOpen(false)}
          onApply={(nextStart, nextEnd) => {
            onApply(nextStart, nextEnd)
            setOpen(false)
          }}
        />
      )}
    </>
  )
}

function DateRangeSheet({
  startDate,
  endDate,
  timezone,
  maxDate,
  onClose,
  onApply,
}: {
  startDate: string
  endDate: string
  timezone: string
  maxDate?: string
  onClose: () => void
  onApply: (startDate: string, endDate: string) => void
}) {
  const boundedEnd = maxDate && endDate > maxDate ? maxDate : endDate
  const boundedStart = startDate > boundedEnd ? boundedEnd : startDate
  const [draft, setDraft] = useState<DateRange | undefined>({
    from: toCalendarDate(boundedStart),
    to: toCalendarDate(boundedEnd),
  })

  return (
    <Sheet open title="Custom date range" manageFocus showCloseButton={false} onClose={onClose}>
      <div className="flex min-h-0 flex-1 justify-center overflow-y-auto px-5 py-2">
        <Calendar
          mode="range"
          selected={draft}
          onSelect={setDraft}
          disabled={maxDate ? { after: toCalendarDate(maxDate) } : undefined}
          timeZone={timezone}
        />
      </div>

      <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          size="lg"
          className="flex-1"
          disabled={!draft?.from || !draft.to}
          onClick={() => {
            if (!draft?.from || !draft.to) return
            onApply(fromCalendarDate(draft.from), fromCalendarDate(draft.to))
          }}
        >
          Apply
        </Button>
      </footer>
    </Sheet>
  )
}

function toCalendarDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number) as [number, number, number]
  return new Date(year, month - 1, day)
}

function fromCalendarDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatIndicatorDate(date: string): string {
  if (!date) return '—'
  const [year, month, day] = date.split('-')
  return `${month}/${day}/${year}`
}
