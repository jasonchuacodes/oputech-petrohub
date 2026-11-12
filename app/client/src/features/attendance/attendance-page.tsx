'use client'

import { Clock3 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { DataTable, type DataTableColumn } from '~/components/ui/data-table'
import { DateRangePicker } from '~/components/ui/date-range-picker'
import { PageHeader } from '~/components/ui/page-header'
import { Spinner } from '~/components/ui/spinner'
import { useSessionQuery } from '../auth/auth.queries'
import { useActiveTenant } from '../layout/use-active-tenant'
import { useTimesheetDaysQuery, useTimesheetsQuery } from './attendance.queries'
import {
  timesheetListHref,
  type TimesheetDateRange,
  userTimesheetHref,
} from './attendance-route'
import { formatHours, formatTimesheetDate, formatTimesheetTime, localDateAt } from './attendance.utils'

const pageSize = 20

export function AttendancePage({ initialRange }: { initialRange?: TimesheetDateRange }) {
  const session = useSessionQuery()
  const selected = useActiveTenant()
  const administrator = selected.role === 'admin' || selected.role === 'superadmin'
  const user = session.data?.user

  if (!user) {
    return <div className="flex min-h-full items-center justify-center"><Spinner className="size-6" /></div>
  }

  return administrator
    ? <TenantTimesheets key={selected.tenant.id} tenantId={selected.tenant.id} initialRange={initialRange} />
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
  const timezone = days.data?.timezone ?? timesheets.data?.timezone ?? 'UTC'
  const visibleDays = days.data?.days.filter((day) => Number(day.effectiveHours) > 0) ?? []
  const dayColumns: DataTableColumn<(typeof visibleDays)[number]>[] = [
    {
      id: 'localDate',
      heading: 'Date',
      cell: (day) => <span className="font-medium text-text-heading">{formatTimesheetDate(day.localDate)}</span>,
    },
    {
      id: 'checkInAt',
      heading: 'Check-in',
      cell: (day) => <span className="tabular-nums">{formatTimesheetTime(day.checkInAt, timezone)}</span>,
    },
    {
      id: 'checkOutAt',
      heading: 'Check-out',
      cell: (day) => <span className="tabular-nums">{formatTimesheetTime(day.checkOutAt, timezone)}</span>,
    },
    {
      id: 'effectiveHours',
      heading: 'Logged hours',
      align: 'right',
      cell: (day) => <span className="font-semibold tabular-nums">{formatHours(day.effectiveHours)} hrs</span>,
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-5 md:p-6 wide:max-w-5xl">
      <PageHeader title="My timesheets" description="Review your logged hours by date." />

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
            <p className="text-sm font-medium text-white/70">Total logged hours</p>
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
                          Check-in {formatTimesheetTime(day.checkInAt, timezone)} · Check-out {formatTimesheetTime(day.checkOutAt, timezone)}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block font-semibold text-text-heading tabular-nums">{formatHours(day.effectiveHours)} hrs</span>
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

function TenantTimesheets({
  tenantId,
  initialRange,
}: {
  tenantId: string
  initialRange?: TimesheetDateRange
}) {
  const router = useRouter()
  const [offset, setOffset] = useState(0)
  const [startDate, setStartDate] = useState<string | undefined>(initialRange?.startDate)
  const [endDate, setEndDate] = useState<string | undefined>(initialRange?.endDate)
  const timesheets = useTimesheetsQuery(tenantId, startDate, endDate, undefined, offset)
  const rangeStart = timesheets.data?.startDate ?? startDate ?? ''
  const rangeEnd = timesheets.data?.endDate ?? endDate ?? ''
  const selectedRange = rangeStart && rangeEnd
    ? { startDate: rangeStart, endDate: rangeEnd }
    : undefined
  const openTimesheet = (userId: string) => {
    router.push(userTimesheetHref(userId, selectedRange))
  }

  const totalCount = timesheets.data?.totalCount ?? 0
  const pageStart = totalCount === 0 ? 0 : offset + 1
  const pageEnd = Math.min(offset + pageSize, totalCount)
  const items = timesheets.data?.items ?? []
  const columns: DataTableColumn<(typeof items)[number]>[] = [
    {
      id: 'fullName',
      heading: 'Member',
      cell: (item) => (
        <Link
          href={userTimesheetHref(item.userId, selectedRange)}
          className="font-bold text-text-heading outline-none hover:underline focus-visible:underline"
        >
          {item.fullName}
        </Link>
      ),
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
              router.replace(timesheetListHref({ startDate: nextStart, endDate: nextEnd }), { scroll: false })
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
                  onClick={() => openTimesheet(item.userId)}
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

    </div>
  )
}
