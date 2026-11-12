'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Clock3, Eye } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { DataTable, type DataTableColumn } from '~/components/ui/data-table'
import { DateRangePicker } from '~/components/ui/date-range-picker'
import { NumberInput } from '~/components/ui/number-input'
import { PageHeader } from '~/components/ui/page-header'
import { Sheet } from '~/components/ui/sheet'
import { Spinner } from '~/components/ui/spinner'
import { useSessionQuery } from '../auth/auth.queries'
import { useActiveTenant } from '../layout/use-active-tenant'
import {
  useSetTimesheetDayOverrideMutation,
  useTimesheetDaysQuery,
  useTimesheetsQuery,
} from './attendance.queries'
import { formatDuration, formatHours, formatTimesheetDate, localDateAt } from './attendance.utils'

const pageSize = 20

export function AttendancePage() {
  const session = useSessionQuery()
  const selected = useActiveTenant()
  const administrator = selected.role === 'admin' || selected.role === 'superadmin'
  const user = session.data?.user

  if (!user) {
    return <div className="flex min-h-full items-center justify-center"><Spinner className="size-6" /></div>
  }

  return administrator
    ? <TenantTimesheets key={selected.tenant.id} tenantId={selected.tenant.id} />
    : <MemberTimesheets key={selected.tenant.id} tenantId={selected.tenant.id} userId={user.id} />
}

function MemberTimesheets({ tenantId, userId }: { tenantId: string; userId: string }) {
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  const timesheets = useTimesheetsQuery(tenantId, startDate, endDate, userId, 0)
  const rangeStart = timesheets.data?.startDate ?? startDate ?? ''
  const rangeEnd = timesheets.data?.endDate ?? endDate ?? ''
  const days = useTimesheetDaysQuery(tenantId, userId, rangeStart, rangeEnd)

  const summary = timesheets.data?.items[0]
  const visibleDays = days.data?.days.filter((day) => Number(day.effectiveHours) > 0) ?? []
  const dayColumns: DataTableColumn<(typeof visibleDays)[number]>[] = [
    {
      id: 'localDate',
      heading: 'Date',
      cell: (day) => <span className="font-medium text-text-heading">{formatTimesheetDate(day.localDate)}</span>,
    },
    {
      id: 'trackedSeconds',
      heading: 'Tracked',
      align: 'right',
      cell: (day) => <span className="tabular-nums">{formatDuration(day.trackedSeconds)}</span>,
    },
    {
      id: 'automaticSeconds',
      heading: 'Automatic',
      align: 'right',
      cell: (day) => <span className="tabular-nums">{formatDuration(day.automaticSeconds)}</span>,
    },
    {
      id: 'effectiveHours',
      heading: 'Credited hours',
      align: 'right',
      cell: (day) => <span className="font-semibold tabular-nums">{formatHours(day.effectiveHours)} hrs</span>,
    },
    {
      id: 'status',
      heading: 'Status',
      cell: (day) => day.overrideHours === null ? 'Credited' : 'Adjusted',
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-5 md:p-6 wide:max-w-5xl">
      <PageHeader title="My timesheets" description="Review your credited hours by date." />

      <div className="flex flex-col gap-1">
        <section aria-label="Timesheet date range" className="flex min-h-12 items-center justify-end">
          <DateRangePicker
            startDate={rangeStart}
            endDate={rangeEnd}
            timezone={timesheets.data?.timezone ?? 'UTC'}
            maxDate={timesheets.data ? localDateAt(timesheets.data.asOf, timesheets.data.timezone) : undefined}
            disabled={timesheets.isFetching}
            onApply={(nextStart, nextEnd) => {
              setStartDate(nextStart)
              setEndDate(nextEnd)
            }}
          />
        </section>

        {timesheets.isPending || (rangeStart && rangeEnd && days.isPending) ? (
          <div className="flex min-h-48 items-center justify-center rounded-md bg-card shadow-card"><Spinner className="size-6" /></div>
        ) : timesheets.isError || days.isError ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
            <p className="text-sm text-text-secondary">Unable to load your timesheet.</p>
            <Button type="button" variant="outline" onClick={() => { void timesheets.refetch(); void days.refetch() }}>Try again</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
          <section aria-label="Range summary" className="rounded-md bg-primary p-5 text-primary-foreground shadow-card">
            <p className="text-sm font-medium text-white/70">Total credited hours</p>
            <p className="mt-2 text-3xl font-semibold text-white tabular-nums">{formatHours(summary?.totalHours ?? 0)} hrs</p>
            {timesheets.data && <p className="mt-2 text-xs text-white/65">{formatTimesheetDate(timesheets.data.startDate)} – {formatTimesheetDate(timesheets.data.endDate)}</p>}
          </section>

          <section aria-label="Daily timesheet">
            {visibleDays.length === 0 ? (
              <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-md bg-card p-6 text-center shadow-card">
                <Clock3 aria-hidden="true" className="size-6 text-text-tertiary" />
                <p className="font-medium text-text-heading">No recorded hours</p>
                <p className="text-sm text-text-secondary">There are no nonzero timesheets in this date range.</p>
              </div>
            ) : (
              <>
                <ul className="overflow-hidden rounded-md bg-card shadow-card md:hidden">
                  {visibleDays.map((day) => (
                    <li key={day.localDate} className="flex min-h-20 items-center gap-3 border-b border-border/60 px-4 py-3 last:border-b-0">
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-text-heading">{formatTimesheetDate(day.localDate)}</span>
                        <span className="mt-1 block text-xs text-text-tertiary">
                          Tracked {formatDuration(day.trackedSeconds)} · Automatic {formatDuration(day.automaticSeconds)}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block font-semibold text-text-heading tabular-nums">{formatHours(day.effectiveHours)} hrs</span>
                        <span className="text-xs text-text-tertiary">{day.overrideHours === null ? 'Credited' : 'Adjusted'}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="hidden md:block">
                  <DataTable
                    collection={DataTable.collection({
                      items: visibleDays,
                      itemToValue: (day) => day.localDate,
                      itemToString: (day) => `${formatTimesheetDate(day.localDate)} timesheet`,
                    })}
                    columns={dayColumns}
                  />
                </div>
              </>
            )}
          </section>
          </div>
        )}
      </div>
    </div>
  )
}

function TenantTimesheets({ tenantId }: { tenantId: string }) {
  const [offset, setOffset] = useState(0)
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  const [selectedUserId, setSelectedUserId] = useState<string>()
  const timesheets = useTimesheetsQuery(tenantId, startDate, endDate, undefined, offset)
  const rangeStart = timesheets.data?.startDate ?? startDate ?? ''
  const rangeEnd = timesheets.data?.endDate ?? endDate ?? ''

  const totalCount = timesheets.data?.totalCount ?? 0
  const pageStart = totalCount === 0 ? 0 : offset + 1
  const pageEnd = Math.min(offset + pageSize, totalCount)
  const items = timesheets.data?.items ?? []
  const columns: DataTableColumn<(typeof items)[number]>[] = [
    {
      id: 'fullName',
      heading: 'Member',
      cell: (item) => <span className="font-medium text-text-heading">{item.fullName}</span>,
    },
    {
      id: 'username',
      heading: 'Username',
      cell: (item) => <span className="text-text-secondary">@{item.username}</span>,
    },
    {
      id: 'totalHours',
      heading: 'Total hours',
      align: 'right',
      cell: (item) => <span className="font-semibold tabular-nums">{formatHours(item.totalHours)} hrs</span>,
    },
    {
      id: 'actions',
      heading: '',
      align: 'right',
      width: 100,
      cell: (item) => (
        <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedUserId(item.userId)}>
          <Eye aria-hidden="true" /> View
        </Button>
      ),
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader title="Timesheets" description="Review and adjust member hours." />

      <div className="flex flex-col gap-1">
        <section aria-label="Timesheet date range" className="flex min-h-12 items-center justify-end">
          <DateRangePicker
            startDate={rangeStart}
            endDate={rangeEnd}
            timezone={timesheets.data?.timezone ?? 'UTC'}
            maxDate={timesheets.data ? localDateAt(timesheets.data.asOf, timesheets.data.timezone) : undefined}
            disabled={timesheets.isFetching}
            onApply={(nextStart, nextEnd) => {
              setOffset(0)
              setStartDate(nextStart)
              setEndDate(nextEnd)
            }}
          />
        </section>

        {timesheets.isPending ? (
          <div className="flex min-h-48 items-center justify-center rounded-md bg-card shadow-card"><Spinner className="size-6" /></div>
        ) : timesheets.isError ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
            <p className="text-sm text-text-secondary">Unable to load timesheets.</p>
            <Button type="button" variant="outline" onClick={() => void timesheets.refetch()}>Try again</Button>
          </div>
        ) : timesheets.data.items.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Clock3 aria-hidden="true" /></span>
            <div><p className="font-medium text-text-heading">No members</p><p className="mt-1 text-sm text-text-secondary">No member timesheets are available for this tenant.</p></div>
          </div>
        ) : (
          <section aria-label="Member timesheets" className="flex flex-col gap-3">
          <ul className="overflow-hidden rounded-md bg-card shadow-card md:hidden">
            {timesheets.data.items.map((item) => (
              <li key={item.userId} className="border-b border-border/60 last:border-b-0">
                <button
                  type="button"
                  className="flex min-h-20 w-full items-center gap-3 px-4 py-3 text-left outline-none hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-ring/30"
                  onClick={() => setSelectedUserId(item.userId)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-text-heading">{item.fullName}</span>
                    <span className="mt-1 block truncate text-sm text-text-tertiary">@{item.username}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-lg font-semibold text-text-heading tabular-nums">{formatHours(item.totalHours)}</span>
                    <span className="text-xs text-text-tertiary">hours</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <DataTable
              collection={DataTable.collection({
                items,
                itemToValue: (item) => item.userId,
                itemToString: (item) => `${item.fullName} timesheet`,
              })}
              columns={columns}
            />
          </div>

          {totalCount > pageSize && (
            <nav aria-label="Timesheet pagination" className="flex items-center justify-between gap-3">
              <p className="text-sm text-text-tertiary">{pageStart}–{pageEnd} of {totalCount}</p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" disabled={offset === 0 || timesheets.isFetching} onClick={() => setOffset(Math.max(0, offset - pageSize))}>Previous</Button>
                <Button type="button" variant="outline" size="sm" disabled={offset + pageSize >= totalCount || timesheets.isFetching} onClick={() => setOffset(offset + pageSize)}>Next</Button>
              </div>
            </nav>
          )}
          </section>
        )}
      </div>

      {selectedUserId && rangeStart && rangeEnd && (
        <UserTimesheetSheet
          tenantId={tenantId}
          userId={selectedUserId}
          startDate={rangeStart}
          endDate={rangeEnd}
          onClose={() => setSelectedUserId(undefined)}
        />
      )}
    </div>
  )
}

function UserTimesheetSheet({
  tenantId,
  userId,
  startDate,
  endDate,
  onClose,
}: {
  tenantId: string
  userId: string
  startDate: string
  endDate: string
  onClose: () => void
}) {
  const timesheet = useTimesheetDaysQuery(tenantId, userId, startDate, endDate)

  return (
    <Sheet open title={timesheet.data?.fullName ?? 'Member timesheet'} description={`${formatTimesheetDate(startDate)} – ${formatTimesheetDate(endDate)}`} manageFocus onClose={onClose}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
        {timesheet.isPending ? (
          <div className="flex min-h-48 items-center justify-center"><Spinner className="size-6" /></div>
        ) : timesheet.isError ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-text-secondary">Unable to load daily hours.</p>
            <Button type="button" variant="outline" onClick={() => void timesheet.refetch()}>Try again</Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {timesheet.data.days.map((day) => (
              <TimesheetDayEditor key={`${day.localDate}:${day.revision}:${day.overrideHours ?? ''}`} tenantId={tenantId} userId={userId} day={day} />
            ))}
          </ul>
        )}
      </div>
    </Sheet>
  )
}

const overrideSchema = z.object({ hours: z.number().min(0, 'Hours cannot be negative') })
type OverrideForm = z.infer<typeof overrideSchema>

function TimesheetDayEditor({
  tenantId,
  userId,
  day,
}: {
  tenantId: string
  userId: string
  day: {
    localDate: string
    trackedSeconds: number
    automaticSeconds: number
    overrideHours?: string | null
    effectiveHours: string
    revision: number
  }
}) {
  const mutation = useSetTimesheetDayOverrideMutation(tenantId)
  const form = useForm<OverrideForm>({
    resolver: zodResolver(overrideSchema),
    mode: 'onChange',
    defaultValues: { hours: day.overrideHours === null || day.overrideHours === undefined ? undefined : Number(day.overrideHours) },
  })

  const save = form.handleSubmit(async ({ hours }) => {
    try {
      await mutation.mutateAsync({
        userId,
        localDate: day.localDate,
        overrideHours: hours.toFixed(2),
        expectedRevision: day.revision,
      })
      toast.success('Timesheet override saved')
    } catch {
      form.setError('root', { message: 'Unable to save. Reload if another administrator changed this day.' })
    }
  })

  const clear = async () => {
    try {
      await mutation.mutateAsync({
        userId,
        localDate: day.localDate,
        overrideHours: null,
        expectedRevision: day.revision,
      })
      toast.success('Using tracked time')
    } catch {
      form.setError('root', { message: 'Unable to clear the override. Reload and try again.' })
    }
  }

  return (
    <li className="rounded-md border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-text-heading">{formatTimesheetDate(day.localDate)}</p>
          <p className="mt-1 text-xs text-text-tertiary">Tracked {formatDuration(day.trackedSeconds)} · Capped {formatDuration(day.automaticSeconds)}</p>
        </div>
        <div className="text-right"><p className="font-semibold text-text-heading tabular-nums">{formatHours(day.effectiveHours)} hrs</p><p className="text-xs text-text-tertiary">Effective</p></div>
      </div>

      <form className="mt-4" onSubmit={save}>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text-heading">Override hours</span>
          <NumberInput control={form.control} name="hours" step={0.01} min={0} placeholder={formatHours(day.effectiveHours)} disabled={mutation.isPending} />
        </label>
        {form.formState.errors.hours?.message && <p className="mt-1 text-sm text-destructive">{form.formState.errors.hours.message}</p>}
        {form.formState.errors.root?.message && <p className="mt-2 text-sm text-destructive">{form.formState.errors.root.message}</p>}
        <div className="mt-3 flex gap-2">
          <Button type="submit" size="sm" className="flex-1" disabled={!form.formState.isValid || mutation.isPending}>{mutation.isPending ? <Spinner className="size-4" /> : null}Save override</Button>
          {day.overrideHours !== null && day.overrideHours !== undefined && (
            <Button type="button" size="sm" variant="outline" className="flex-1" disabled={mutation.isPending} onClick={() => void clear()}>Use tracked time</Button>
          )}
        </div>
      </form>
    </li>
  )
}
