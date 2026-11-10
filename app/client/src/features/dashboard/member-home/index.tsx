'use client'

import { Bell, ChevronRight, FilePlus2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Button } from '~/components/ui/button'
import { PageHeader } from '~/components/ui/page-header'
import { useSessionQuery } from '../../auth/auth.queries'
import { CreateReportSheet } from '../../reports/create-report-sheet'
import { formatBusinessDate } from '../../reports/create-report-sheet'
import { useReportCreationContextQuery } from '../../reports/reports.queries'
import { useActiveTenant } from '../../layout/use-active-tenant'

export function MemberHomePage() {
  const router = useRouter()
  const session = useSessionQuery()
  const { tenant } = useActiveTenant()
  const reports = useReportCreationContextQuery(tenant.id)
  const [showCreateReport, setShowCreateReport] = useState(false)
  const [isCheckedIn, setIsCheckedIn] = useState(true)
  const user = session.data?.user
  const greetingName = user?.firstName?.trim() || user?.username || 'there'

  const closeCreateReport = useCallback(() => setShowCreateReport(false), [])
  const openReport = useCallback(
    (reportId: string) => {
      setShowCreateReport(false)
      router.push(`/report/${reportId}`)
    },
    [router],
  )

  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader
        title={`Good morning, ${greetingName}`}
        description={user?.username ? `@${user.username}` : undefined}
        action={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notifications are not available"
            className="wide:size-11"
            disabled
          >
            <Bell aria-hidden="true" />
          </Button>
        }
      />

      <section
        aria-label="Attendance status"
        className="overflow-hidden rounded-md bg-primary text-primary-foreground shadow-card"
      >
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-white/75 sm:text-base">
               {reports.data ? formatBusinessDate(reports.data.businessDate) : 'Today'}
            </p>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${
                  isCheckedIn ? 'bg-emerald-400 shadow-[0_0_0_3px_rgb(52_211_153/0.15)]' : 'bg-white/40'
                }`}
              />
              {isCheckedIn ? 'On shift' : 'Off shift'}
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-[0.14em] text-white/60 uppercase">
                {isCheckedIn ? 'Time on shift' : 'Attendance'}
              </p>
              <p
                className="mt-1 text-[clamp(1.5rem,5vw,2.5rem)] leading-none font-semibold tracking-tight text-white tabular-nums"
                aria-live="polite"
              >
                {isCheckedIn ? '04:19:09' : '00:00:00'}
                <span className="ml-2 text-base font-medium tracking-normal text-white/65">hrs</span>
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isCheckedIn}
              aria-label={isCheckedIn ? 'Check out' : 'Check in'}
              onClick={() => setIsCheckedIn((checkedIn) => !checkedIn)}
              className="group flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-md p-2 text-sm font-semibold text-white outline-none transition-transform active:scale-[0.99] focus-visible:ring-3 focus-visible:ring-white/60 sm:min-h-14 sm:px-4"
            >
              <span className="hidden sm:inline">{isCheckedIn ? 'Check out' : 'Check in'}</span>
              <span
                aria-hidden="true"
                className={`flex h-9 w-15 items-center rounded-full p-0.5 transition-colors duration-200 ${
                  isCheckedIn ? 'bg-emerald-500' : 'bg-white/25'
                }`}
              >
                <span
                  className={`size-8 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    isCheckedIn ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="overview-heading">
        <h2
          id="overview-heading"
          className="flex min-h-10 items-center font-sans text-sm font-semibold tracking-[0.14em] text-text-heading uppercase"
        >
          Reports overview
        </h2>
        <div className="overflow-hidden rounded-md bg-card shadow-card">
            {reports.data?.slots.map(({ shift, report }, index) => (
              <div
                key={shift.id}
                className="border-b border-border/60 px-4 py-3 last:border-b-0"
              >
                <div className="flex min-h-7 items-center justify-between gap-3">
                  <span className="flex min-w-0 items-baseline gap-1.5">
                    <span className="shrink-0 font-semibold text-text-heading">
                      {formatShiftNumber(index)}
                    </span>
                    <span className="truncate text-sm font-normal text-text-tertiary">
                      ({formatTime(shift.startTime)}–{formatTime(shift.endTime)})
                    </span>
                  </span>
                  {report && (
                    <Link
                      href={`/report/${report.id}`}
                      aria-label={`View ${formatShiftNumber(index)} report`}
                      className="group flex size-9 items-center justify-center rounded-sm text-primary outline-none hover:bg-primary/10 focus-visible:ring-3 focus-visible:ring-ring/30"
                    >
                      <ChevronRight
                        aria-hidden="true"
                        className="size-5 transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  )}
                </div>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-sm text-text-secondary">
                    {report ? `Created by: ${report.creatorName}` : 'Not created yet'}
                  </p>
                  <span
                    className={`shrink-0 rounded-sm px-2 py-0.5 text-xs font-medium ${
                      report?.status === 'submitted'
                        ? 'bg-status-success/12 text-status-success'
                        : report
                          ? 'bg-status-warning/12 text-status-warning'
                          : 'bg-muted text-text-secondary'
                    }`}
                  >
                    {report?.status === 'submitted' ? 'Submitted' : report ? 'Draft' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
            {reports.isPending && (
              <p className="p-4 text-sm text-text-secondary">Loading report overview…</p>
            )}
            {reports.isError && (
              <p className="p-4 text-sm text-destructive">Unable to load report overview.</p>
            )}
            {reports.data?.slots.length === 0 && (
              <p className="p-4 text-sm text-text-secondary">No shifts configured.</p>
            )}
        </div>
      </section>

      <section aria-labelledby="actions-heading">
        <h2
          id="actions-heading"
          className="flex min-h-10 items-center font-sans text-sm font-semibold tracking-[0.14em] text-text-heading uppercase"
        >
          Actions
        </h2>
        <button
          type="button"
          className="group flex min-h-24 w-full items-center gap-4 rounded-md bg-card px-5 py-4 text-left shadow-card outline-none transition-colors hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-ring/30"
          onClick={() => setShowCreateReport(true)}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FilePlus2 aria-hidden="true" className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-text-heading">Create report</span>
            <span className="mt-1 block text-sm text-text-secondary">
              Choose a shift and submit your report.
            </span>
          </span>
        </button>
      </section>

      {showCreateReport && (
        <CreateReportSheet onClose={closeCreateReport} onOpenReport={openReport} />
      )}
    </div>
  )
}

function formatShiftNumber(index: number): string {
  const number = index + 1
  const remainder = number % 100
  const suffix =
    remainder >= 11 && remainder <= 13
      ? 'th'
      : number % 10 === 1
        ? 'st'
        : number % 10 === 2
          ? 'nd'
          : number % 10 === 3
            ? 'rd'
            : 'th'
  return `${number}${suffix} shift`
}

function formatTime(value: string): string {
  const [hours = 0, minutes = '00'] = value.split(':')
  const hour = Number(hours)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${period}`
}
