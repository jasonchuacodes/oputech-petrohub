'use client'

import { Bell, CheckCircle2, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Button } from '~/components/ui/button'
import { ContentSection } from '~/components/ui/content-section'
import { PageHeader } from '~/components/ui/page-header'
import { useSessionQuery } from '../../auth/auth.queries'
import { CreateReportSheet } from '../../reports/create-report-sheet'
import {
  reportPreviewDate,
  reportShiftPreviews,
  type ReportPreviewId,
} from '../../reports/report-preview-data'

export function MemberHomePage() {
  const router = useRouter()
  const session = useSessionQuery()
  const [showCreateReport, setShowCreateReport] = useState(false)
  const [isCheckedIn, setIsCheckedIn] = useState(true)
  const user = session.data?.user
  const greetingName = user?.firstName?.trim() || user?.username || 'there'

  const closeCreateReport = useCallback(() => setShowCreateReport(false), [])
  const openReport = useCallback(
    (reportId: ReportPreviewId) => {
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
              {reportPreviewDate.label} · Tuesday
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

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
        <ContentSection label="Today’s reports">
          <div className="overflow-hidden rounded-md bg-card shadow-card">
            {reportShiftPreviews.map((shift) => (
              <div
                key={shift.id}
                className="flex min-h-24 items-center gap-3 border-b border-border/60 px-4 py-3 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-text-heading">{shift.ordinal}</h3>
                  <p className="text-sm text-text-secondary">{shift.time}</p>
                  {shift.state === 'submitted' ? (
                    <span className="mt-1 inline-flex rounded-sm bg-status-success/12 px-2 py-0.5 text-xs font-medium text-status-success">
                      Submitted · {shift.submittedBy}
                    </span>
                  ) : (
                    <span className="mt-1 inline-flex rounded-sm bg-status-warning/12 px-2 py-0.5 text-xs font-medium text-status-warning">
                      Not started
                    </span>
                  )}
                </div>
                {shift.state === 'submitted' && (
                  <Button type="button" variant="ghost" disabled className="gap-1 px-2">
                    View
                    <ChevronRight aria-hidden="true" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <Button type="button" className="w-full wide:h-11" onClick={() => setShowCreateReport(true)}>
              Create report
            </Button>
            <Button asChild variant="ghost" className="w-full wide:h-11">
              <Link href="/report">View all reports</Link>
            </Button>
          </div>
        </ContentSection>

        <ContentSection label="Recent attendance">
          <Link
            href="/timesheet"
            className="flex min-h-20 items-center gap-3 rounded-md bg-card p-4 shadow-card outline-none transition-colors hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-status-success/12 text-status-success">
              <CheckCircle2 aria-hidden="true" className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-text-heading">Checked in</span>
              <span className="block text-sm text-text-tertiary">Today, 12:35 PM</span>
            </span>
            <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-primary" />
          </Link>
        </ContentSection>
      </div>

      {showCreateReport && (
        <CreateReportSheet onClose={closeCreateReport} onOpenReport={openReport} />
      )}
    </div>
  )
}
