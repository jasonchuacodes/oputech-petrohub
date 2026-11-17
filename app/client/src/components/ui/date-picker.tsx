'use client'

import * as Popover from '@radix-ui/react-popover'
import { CalendarDays, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useMediaQuery } from '~/hooks/useMediaQuery'
import { Button } from './button'
import { Calendar } from './calendar'
import { Sheet } from './sheet'

const wideMediaQuery = '(min-width: 75rem)'

type DatePickerProps = {
  value: string
  timezone: string
  disabled?: boolean
  onChange: (value: string) => void
}

export function DatePicker({ value, timezone, disabled, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const desktop = useMediaQuery(wideMediaQuery)
  const trigger = (
    <button
      type="button"
      disabled={disabled}
      className="flex min-h-11 w-full items-center gap-3 rounded-sm border border-input bg-card px-3 text-left outline-none transition-colors focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-50 wide:min-h-10"
      onClick={() => { if (!desktop) setOpen(true) }}
    >
      <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />
      <span className={value ? 'min-w-0 flex-1 truncate text-sm text-text-heading' : 'min-w-0 flex-1 truncate text-sm text-text-tertiary'}>
        {value ? formatDate(value) : 'Select date'}
      </span>
      <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />
    </button>
  )

  if (desktop) {
    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content align="start" sideOffset={8} aria-label="Select date" className="z-[70] overflow-hidden rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
            <DatePickerPanel key={value || 'empty'} value={value} timezone={timezone} onClose={() => setOpen(false)} onApply={(nextValue) => { onChange(nextValue); setOpen(false) }} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    )
  }

  return (
    <>
      {trigger}
      {open && <DatePickerSheet key={value || 'empty'} value={value} timezone={timezone} onClose={() => setOpen(false)} onApply={(nextValue) => { onChange(nextValue); setOpen(false) }} />}
    </>
  )
}

function DatePickerSheet({ value, timezone, onClose, onApply }: DatePickerContentProps) {
  const [selected, setSelected] = useState<Date | undefined>(value ? toCalendarDate(value) : undefined)
  return (
    <Sheet open layer="nested" title="Select date" icon={CalendarDays} manageFocus showCloseButton={false} onClose={onClose}>
      <div className="flex min-h-0 flex-1 justify-center overflow-y-auto px-5 py-2">
        <Calendar mode="single" selected={selected} onSelect={setSelected} timeZone={timezone} />
      </div>
      <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="button" size="lg" className="flex-1" disabled={!selected} onClick={() => selected && onApply(fromCalendarDate(selected))}>Apply</Button>
      </footer>
    </Sheet>
  )
}

function DatePickerPanel({ value, timezone, onClose, onApply }: DatePickerContentProps) {
  const [selected, setSelected] = useState<Date | undefined>(value ? toCalendarDate(value) : undefined)
  return (
    <div>
      <Calendar mode="single" selected={selected} onSelect={setSelected} timeZone={timezone} />
      <div className="mt-3 flex justify-end gap-2 border-t border-border pt-3">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button type="button" size="sm" disabled={!selected} onClick={() => selected && onApply(fromCalendarDate(selected))}>Apply</Button>
      </div>
    </div>
  )
}

type DatePickerContentProps = {
  value: string
  timezone: string
  onClose: () => void
  onApply: (value: string) => void
}

function toCalendarDate(value: string) {
  const [year, month, day] = value.split('-').map(Number) as [number, number, number]
  return new Date(year, month - 1, day)
}

function fromCalendarDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long', day: 'numeric' }).format(toCalendarDate(value))
}
