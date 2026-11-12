'use client'

import { CalendarClock, ChevronDown, Clock3 } from 'lucide-react'
import { useRef, useState, type RefObject } from 'react'
import { Button } from './button'
import { Calendar } from './calendar'
import { Input } from './input'
import { Sheet } from './sheet'

type DateTimePickerProps = {
  value: string
  timezone: string
  disabled?: boolean
  onChange: (value: string) => void
}

export function DateTimePicker({ value, timezone, disabled, onChange }: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className="flex min-h-11 w-full items-center gap-3 rounded-sm border border-input bg-card px-3 text-left outline-none transition-colors focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-50 wide:min-h-10"
        onClick={() => setOpen(true)}
      >
        <CalendarClock aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />
        <span className={value ? 'min-w-0 flex-1 truncate text-sm text-text-heading' : 'min-w-0 flex-1 truncate text-sm text-text-tertiary'}>
          {value ? formatDateTimeValue(value) : 'Select date and time'}
        </span>
        <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />
      </button>

      {open && (
        <DateTimeSheet
          key={value || 'new'}
          value={value}
          timezone={timezone}
          returnFocusRef={triggerRef}
          onClose={() => setOpen(false)}
          onApply={(nextValue) => {
            onChange(nextValue)
            setOpen(false)
          }}
        />
      )}
    </>
  )
}

function DateTimeSheet({
  value,
  timezone,
  returnFocusRef,
  onClose,
  onApply,
}: {
  value: string
  timezone: string
  returnFocusRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
  onApply: (value: string) => void
}) {
  const initial = parseDateTimeValue(value)
  const [date, setDate] = useState<Date | undefined>(initial.date)
  const [time, setTime] = useState(initial.time)
  const [step, setStep] = useState<'date' | 'time'>('date')

  return (
    <Sheet
      open
      layer="nested"
      title={step === 'date' ? 'Select date' : 'Select time'}
      manageFocus
      showCloseButton={false}
      returnFocusRef={returnFocusRef}
      onClose={onClose}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-5">
        {step === 'date' ? (
          <div className="flex justify-center py-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              timeZone={timezone}
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center py-8">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock3 aria-hidden="true" className="size-5" />
            </span>
            {date && (
              <p className="mt-3 text-sm font-medium text-text-heading">{formatCalendarDate(date)}</p>
            )}
            <label className="mt-6 flex w-full max-w-xs flex-col gap-1.5">
              <span className="text-sm font-medium">Time</span>
              <Input
                autoFocus
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </label>
          </div>
        )}
      </div>
      <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={step === 'date' ? onClose : () => setStep('date')}
        >
          {step === 'date' ? 'Cancel' : 'Back'}
        </Button>
        {step === 'date' ? (
          <Button
            type="button"
            size="lg"
            className="flex-1"
            disabled={!date}
            onClick={() => setStep('time')}
          >
            Next
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            className="flex-1"
            disabled={!date || !time}
            onClick={() => date && time && onApply(`${fromCalendarDate(date)}T${time}`)}
          >
            Apply
          </Button>
        )}
      </footer>
    </Sheet>
  )
}

function parseDateTimeValue(value: string): { date?: Date; time: string } {
  const [dateValue, time = ''] = value.split('T')
  if (!dateValue) return { time }
  const [year, month, day] = dateValue.split('-').map(Number)
  if (!year || !month || !day) return { time }
  return { date: new Date(year, month - 1, day), time }
}

function fromCalendarDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatCalendarDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatDateTimeValue(value: string): string {
  const parsed = parseDateTimeValue(value)
  if (!parsed.date || !parsed.time) return value
  const [hours, minutes] = parsed.time.split(':').map(Number)
  const date = new Date(
    parsed.date.getFullYear(),
    parsed.date.getMonth(),
    parsed.date.getDate(),
    hours,
    minutes,
  )
  const datePart = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
  const timePart = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
  return `${datePart} - ${timePart}`
}
