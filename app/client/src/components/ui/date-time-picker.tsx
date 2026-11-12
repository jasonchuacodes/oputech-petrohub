'use client'

import { CalendarClock, ChevronDown, Clock3 } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from 'react'
import { cn } from '~/utils/cn'
import { Button } from './button'
import { Calendar } from './calendar'
import { parseHourOnlyTime, toHourOnlyTime, type TimePeriod } from './date-time-picker.utils'
import { Input } from './input'
import { Sheet } from './sheet'

type DateTimePickerProps = {
  value: string
  timezone: string
  disabled?: boolean
  hourOnly?: boolean
  onChange: (value: string) => void
}

export function DateTimePicker({ value, timezone, disabled, hourOnly = false, onChange }: DateTimePickerProps) {
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
          {value ? formatDateTimeValue(value, hourOnly) : hourOnly ? 'Select date and hour' : 'Select date and time'}
        </span>
        <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />
      </button>

      {open && (
        <DateTimeSheet
          key={value || 'new'}
          value={value}
          timezone={timezone}
          hourOnly={hourOnly}
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
  hourOnly,
  returnFocusRef,
  onClose,
  onApply,
}: {
  value: string
  timezone: string
  hourOnly: boolean
  returnFocusRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
  onApply: (value: string) => void
}) {
  const initial = parseDateTimeValue(value)
  const initialHourOnlyTime = hourOnly ? parseHourOnlyTime(initial.time) : null
  const [date, setDate] = useState<Date | undefined>(initial.date ?? todayInTimezone(timezone))
  const [time, setTime] = useState(hourOnly ? '' : initial.time)
  const [hour, setHour] = useState(initialHourOnlyTime?.hour ?? 1)
  const [period, setPeriod] = useState<TimePeriod>(initialHourOnlyTime?.period ?? 'AM')
  const [step, setStep] = useState<'date' | 'time'>('date')
  const selectedTime = hourOnly ? toHourOnlyTime(hour, period) : time

  return (
    <Sheet
      open
      layer="nested"
      title={step === 'date' ? 'Select date' : hourOnly ? 'Select effective time' : 'Select time'}
      description={step === 'time' && hourOnly
        ? 'Choose any hour, including an earlier hour today. Minutes are fixed at 00.'
        : undefined}
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
          <div className="flex flex-1 flex-col items-center py-8">
            {hourOnly ? (
              <div className="w-full">
                <HourOnlyPicker
                  hour={hour}
                  period={period}
                  onHourChange={setHour}
                  onPeriodChange={setPeriod}
                />
              </div>
            ) : (
              <>
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock3 aria-hidden="true" className="size-5" />
                </span>
                {date && (
                  <p className="mt-3 text-sm font-medium text-text-heading">{formatCalendarDate(date)}</p>
                )}
                <label className="mt-6 flex w-full max-w-xs flex-col gap-1.5">
                  <span className="text-sm font-medium">Time</span>
                  <Input autoFocus type="time" value={time} onChange={(event) => setTime(event.target.value)} />
                </label>
              </>
            )}
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
            disabled={!date || !selectedTime}
            onClick={() => date && selectedTime && onApply(`${fromCalendarDate(date)}T${selectedTime}`)}
          >
            Apply
          </Button>
        )}
      </footer>
    </Sheet>
  )
}

const wheelRowHeight = 48
const hourOptions = Array.from({ length: 12 }, (_, index) => index + 1)

function HourOnlyPicker({
  hour,
  period,
  onHourChange,
  onPeriodChange,
}: {
  hour: number
  period: TimePeriod
  onHourChange: (hour: number) => void
  onPeriodChange: (period: TimePeriod) => void
}) {
  return (
    <div className="w-full">
      <div aria-hidden="true" className="mb-2 grid grid-cols-3 text-center text-xs font-semibold tracking-wider text-text-secondary">
        <span>HH</span>
        <span>MM</span>
        <span>AM/PM</span>
      </div>
      <div className="relative grid h-60 grid-cols-3 overflow-hidden rounded-md border border-input bg-card">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-2 top-24 z-0 h-12 rounded-sm border-y border-primary/15 bg-primary/10" />
        <HourWheel value={hour} onChange={onHourChange} />
        <LockedMinuteWheel />
        <PeriodWheel value={period} onChange={onPeriodChange} />
      </div>
    </div>
  )
}

function HourWheel({ value, onChange }: { value: number; onChange: (hour: number) => void }) {
  const listId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const initialIndexRef = useRef(hourOptions.indexOf(value))
  const selectedIndexRef = useRef(hourOptions.indexOf(value))

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    list.scrollTop = initialIndexRef.current * wheelRowHeight
    list.focus({ preventScroll: true })
  }, [])

  const selectIndex = (index: number, scroll = false) => {
    const nextIndex = Math.max(0, Math.min(hourOptions.length - 1, index))
    selectedIndexRef.current = nextIndex
    onChange(hourOptions[nextIndex])
    if (scroll) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      listRef.current?.scrollTo({
        top: nextIndex * wheelRowHeight,
        behavior: reduceMotion ? 'auto' : 'smooth',
      })
    }
  }

  const handleScroll = () => {
    const list = listRef.current
    if (!list) return
    const nextIndex = Math.max(0, Math.min(hourOptions.length - 1, Math.round(list.scrollTop / wheelRowHeight)))
    if (nextIndex !== selectedIndexRef.current) selectIndex(nextIndex)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let nextIndex: number | undefined
    if (event.key === 'ArrowDown') nextIndex = selectedIndexRef.current + 1
    if (event.key === 'ArrowUp') nextIndex = selectedIndexRef.current - 1
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = hourOptions.length - 1
    if (nextIndex === undefined) return
    event.preventDefault()
    selectIndex(nextIndex, true)
  }

  return (
    <div
      ref={listRef}
      role="listbox"
      tabIndex={0}
      aria-label="Hour"
      aria-activedescendant={`${listId}-${value}`}
      className="relative z-10 snap-y snap-mandatory overflow-y-auto overscroll-contain py-24 outline-none [scrollbar-width:none] focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30 [&::-webkit-scrollbar]:hidden"
      onKeyDown={handleKeyDown}
      onScroll={handleScroll}
    >
      {hourOptions.map((option) => {
        const selected = value === option
        return (
          <button
            id={`${listId}-${option}`}
            key={option}
            type="button"
            role="option"
            tabIndex={-1}
            aria-selected={selected}
            className={cn(
              'flex h-12 w-full snap-center snap-always items-center justify-center text-lg outline-none transition-colors',
              selected ? 'font-semibold text-text-heading' : 'text-text-tertiary',
            )}
            onClick={() => selectIndex(hourOptions.indexOf(option), true)}
          >
            {String(option).padStart(2, '0')}
          </button>
        )
      })}
    </div>
  )
}

function LockedMinuteWheel() {
  const minutes = ['58', '59', '00', '01', '02']

  return (
    <div role="group" aria-label="Minutes, fixed at 00" className="relative z-10 border-x border-border/60 bg-muted/25">
      <div aria-hidden="true" className="flex h-full flex-col justify-center">
        {minutes.map((minute) => (
          <span
            key={minute}
            className={cn(
              'flex h-12 shrink-0 items-center justify-center text-lg',
              minute === '00' ? 'font-semibold text-text-heading' : 'text-text-tertiary/45',
            )}
          >
            {minute}
          </span>
        ))}
      </div>
    </div>
  )
}

const periodOptions: TimePeriod[] = ['AM', 'PM']

function PeriodWheel({
  value,
  onChange,
}: {
  value: TimePeriod
  onChange: (period: TimePeriod) => void
}) {
  const listId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const initialIndexRef = useRef(periodOptions.indexOf(value))
  const selectedIndexRef = useRef(periodOptions.indexOf(value))

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = initialIndexRef.current * wheelRowHeight
  }, [])

  const selectIndex = (index: number, scroll = false) => {
    const nextIndex = Math.max(0, Math.min(periodOptions.length - 1, index))
    selectedIndexRef.current = nextIndex
    onChange(periodOptions[nextIndex])
    if (scroll) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      listRef.current?.scrollTo({
        top: nextIndex * wheelRowHeight,
        behavior: reduceMotion ? 'auto' : 'smooth',
      })
    }
  }

  const handleScroll = () => {
    const list = listRef.current
    if (!list) return
    const nextIndex = Math.max(0, Math.min(periodOptions.length - 1, Math.round(list.scrollTop / wheelRowHeight)))
    if (nextIndex !== selectedIndexRef.current) selectIndex(nextIndex)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let nextIndex: number | undefined
    if (event.key === 'ArrowDown') nextIndex = selectedIndexRef.current + 1
    if (event.key === 'ArrowUp') nextIndex = selectedIndexRef.current - 1
    if (event.key === 'Home') nextIndex = 1
    if (event.key === 'End') nextIndex = periodOptions.length - 1
    if (nextIndex === undefined) return
    event.preventDefault()
    selectIndex(nextIndex, true)
  }

  return (
    <div
      ref={listRef}
      role="listbox"
      tabIndex={0}
      aria-label="AM or PM"
      aria-activedescendant={`${listId}-${value}`}
      className="relative z-10 snap-y snap-mandatory overflow-y-auto overscroll-contain py-24 outline-none [scrollbar-width:none] focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30 [&::-webkit-scrollbar]:hidden"
      onKeyDown={handleKeyDown}
      onScroll={handleScroll}
    >
      {periodOptions.map((option) => {
        const selected = value === option
        return (
          <button
            id={`${listId}-${option}`}
            key={option}
            type="button"
            role="option"
            tabIndex={-1}
            aria-selected={selected}
            className={cn(
              'flex h-12 w-full snap-center snap-always items-center justify-center text-lg outline-none transition-colors',
              selected ? 'font-semibold text-text-heading' : 'text-text-tertiary',
            )}
            onClick={() => selectIndex(periodOptions.indexOf(option), true)}
          >
            {option}
          </button>
        )
      })}
    </div>
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

function todayInTimezone(timezone: string): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return new Date(Number(values.year), Number(values.month) - 1, Number(values.day))
}

function formatCalendarDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatDateTimeValue(value: string, hourOnly = false): string {
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
    ...(hourOnly ? {} : { minute: '2-digit' as const }),
  }).format(date)
  return `${datePart} - ${timePart}`
}
