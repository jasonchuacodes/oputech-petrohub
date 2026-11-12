'use client'

import { Clock3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { DataTable, type DataTableColumn } from '~/components/ui/data-table'
import { DateRangePicker } from '~/components/ui/date-range-picker'
import { PageHeader } from '~/components/ui/page-header'
import { PageIntro } from '~/components/ui/page-intro'
import { Spinner } from '~/components/ui/spinner'
import type { TimesheetDayFieldsFragment } from '~/generated/graphql'
import { useActiveTenant } from '../layout/use-active-tenant'
import { useTimesheetDaysQuery, useTimesheetsQuery } from './attendance.queries'
import {
  timesheetListHref,
  type TimesheetDateRange,
  userTimesheetHref,
} from './attendance-route'
import { formatDuration, formatHours, formatTimesheetDate, localDateAt } from './attendance.utils'
import { TimesheetDayEditor } from './timesheet-day-editor'

export function UserTimesheetPage({
  userId,
  initialRange,
}: {
  userId: string
  initialRange?: TimesheetDateRange
}) {
  const access = useActiveTenant()
  const router = useRouter()
  const administrator = access.role === 'admin' || access.role === 'superadmin'

  useEffect(() => {
    if (!administrator) router.replace('/timesheet')
  }, [administrator, router])

  if (!administrator) {
    return <div className="flex min-h-full items-center justify-center"><Spinner className="size-6" /></div>
  }

  return (
    <AdminUserTimesheetPage
      key={`${access.tenant.id}:${userId}`}
      tenantId={access.tenant.id}
      userId={userId}
      initialRange={initialRange}
    />
  )
}

function AdminUserTimesheetPage({
  tenantId,
  userId,
  initialRange,
}: {
  tenantId: string
  userId: string
  initialRange?: TimesheetDateRange
}) {
  const router = useRouter()
  const [startDate, setStartDate] = useState<string | undefined>(initialRange?.startDate)
  const [endDate, setEndDate] = useState<string | undefined>(initialRange?.endDate)
  const [selectedDay, setSelectedDay] = useState<TimesheetDayFieldsFragment>()
  const summary = useTimesheetsQuery(tenantId, startDate, endDate, userId, 0)
  const rangeStart = summary.data?.startDate ?? startDate ?? ''
  const rangeEnd = summary.data?.endDate ?? endDate ?? ''
  const range = rangeStart && rangeEnd
    ? { startDate: rangeStart, endDate: rangeEnd }
    : undefined
  const timesheet = useTimesheetDaysQuery(tenantId, userId, rangeStart, rangeEnd)
  const days = timesheet.data?.days.filter((day) => Number(day.effectiveHours) > 0) ?? []
  const member = timesheet.data ?? summary.data?.items[0]
  const memberName = member?.fullName ?? 'Member timesheet'

  const columns: DataTableColumn<TimesheetDayFieldsFragment>[] = [
    {
      id: 'localDate',
      heading: 'Date',
      cell: (day) => (
        <button
          type="button"
          className="font-bold text-text-heading outline-none hover:underline focus-visible:underline"
          onClick={() => setSelectedDay(day)}
        >
          {formatTimesheetDate(day.localDate)}
        </button>
      ),
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
      heading: 'Logged hours',
      align: 'right',
      cell: (day) => (
        <span className="font-semibold text-text-heading tabular-nums">
          {formatHours(day.effectiveHours)} hrs
        </span>
      ),
    },
  ]

  const retry = () => {
    void summary.refetch()
    void timesheet.refetch()
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader
        title="Timesheet Details"
        backHref={timesheetListHref(range)}
        backLabel="Back to timesheets"
      />

      <PageIntro>Review and adjust logged hours for the selected period.</PageIntro>

      {member && (
        <MemberSummary
          fullName={member.fullName}
          username={member.username}
          totalHours={summary.data?.items[0]?.totalHours ?? 0}
        />
      )}

      <div className="flex flex-col gap-1">
        <section aria-label="Timesheet date range" className="flex min-h-12 items-center justify-end">
          <DateRangePicker
            startDate={rangeStart}
            endDate={rangeEnd}
            timezone={summary.data?.timezone ?? 'UTC'}
            maxDate={summary.data ? localDateAt(summary.data.asOf, summary.data.timezone) : undefined}
            disabled={summary.isFetching}
            onApply={(nextStart, nextEnd) => {
              const nextRange = { startDate: nextStart, endDate: nextEnd }
              setStartDate(nextStart)
              setEndDate(nextEnd)
              setSelectedDay(undefined)
              router.replace(userTimesheetHref(userId, nextRange), { scroll: false })
            }}
          />
        </section>

        {summary.isPending || (rangeStart && rangeEnd && timesheet.isPending) ? (
          <div className="flex min-h-48 items-center justify-center rounded-md bg-card shadow-card">
            <Spinner className="size-6" />
          </div>
        ) : summary.isError || timesheet.isError ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
            <p className="text-sm text-text-secondary">Unable to load this member’s timesheet.</p>
            <Button type="button" variant="outline" onClick={retry}>Try again</Button>
          </div>
        ) : days.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
            <Clock3 aria-hidden="true" className="size-6 text-text-tertiary" />
            <p className="text-sm text-text-secondary">No timesheets are available for this period.</p>
          </div>
        ) : (
          <section aria-label="Daily timesheets">
            <ul className="overflow-hidden rounded-md bg-card shadow-card md:hidden">
              {days.map((day) => (
                <li key={day.localDate} className="border-b border-border/60 last:border-b-0">
                  <button
                    type="button"
                    className="flex min-h-20 w-full items-center gap-3 px-4 py-3 text-left outline-none hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-ring/30"
                    onClick={() => setSelectedDay(day)}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-text-heading">
                        {formatTimesheetDate(day.localDate)}
                      </span>
                      <span className="mt-1 block text-xs text-text-tertiary">
                        Tracked {formatDuration(day.trackedSeconds)} · Automatic {formatDuration(day.automaticSeconds)}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block font-semibold text-text-heading tabular-nums">
                        {formatHours(day.effectiveHours)} hrs
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="hidden md:block">
              <DataTable
                collection={DataTable.collection({
                  items: days,
                  itemToValue: (day) => day.localDate,
                  itemToString: (day) => `${formatTimesheetDate(day.localDate)} timesheet`,
                })}
                columns={columns}
              />
            </div>
          </section>
        )}
      </div>

      {selectedDay && (
        <TimesheetDayEditor
          key={`${selectedDay.localDate}:${selectedDay.revision}:${selectedDay.overrideHours ?? ''}`}
          tenantId={tenantId}
          userId={userId}
          memberName={memberName}
          day={selectedDay}
          onClose={() => setSelectedDay(undefined)}
        />
      )}
    </div>
  )
}

function MemberSummary({
  fullName,
  username,
  totalHours,
}: {
  fullName: string
  username: string
  totalHours: string | number
}) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const initials = parts.length > 1
    ? `${parts[0]?.[0] ?? ''}${parts.at(-1)?.[0] ?? ''}`.toUpperCase()
    : (parts[0] || username).slice(0, 2).toUpperCase()

  return (
    <section
      aria-label="Timesheet member"
      className="flex items-center gap-3 rounded-md border border-primary/15 bg-primary/5 p-4"
    >
      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
      >
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-text-heading">{fullName}</p>
        <p className="mt-0.5 truncate text-sm text-text-secondary">@{username}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-semibold text-text-heading tabular-nums">
          {formatHours(totalHours)} hrs
        </p>
        <p className="mt-0.5 text-xs text-text-tertiary">Period total</p>
      </div>
    </section>
  )
}
