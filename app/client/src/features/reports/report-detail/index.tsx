'use client'

import { ArrowLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { ContentSection } from '~/components/ui/content-section'
import { useActiveTenant } from '../../layout/use-active-tenant'
import { reportDetailPreview, type ReportPreviewId } from '../report-preview-data'

const reportSections = [
  { title: 'Fuel readings', description: 'Add readings', action: 'Add' },
  { title: 'Lubricants', description: 'No entries', action: 'Add' },
  { title: 'Expenses', description: 'No entries', action: 'Add' },
  { title: 'Deposits', description: 'No entries', action: 'Add' },
  { title: 'Disposals', description: 'No entries', action: 'Add' },
  { title: 'On duty', description: 'You, Michael', action: 'Edit' },
] as const

export function ReportDetailPage({ reportId }: { reportId: ReportPreviewId }) {
  const router = useRouter()
  const access = useActiveTenant()
  const isMember = access.role === 'member'

  useEffect(() => {
    if (!isMember) router.replace('/report')
  }, [isMember, router])

  if (!isMember || reportId !== reportDetailPreview.id) return null

  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-5 py-5 md:p-6">
      <header className="flex min-h-11 items-start gap-2">
        <Button asChild variant="ghost" size="icon" className="-ml-3 wide:size-11">
          <Link href="/home" aria-label="Back to home">
            <ArrowLeft aria-hidden="true" />
          </Link>
        </Button>
        <div className="min-w-0 pt-1">
          <h1 className="text-page-title font-semibold">Shift report</h1>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-text-secondary">{reportDetailPreview.date.label}</p>
          <p className="text-lg font-semibold text-text-heading">
            {reportDetailPreview.shift.ordinal} · {reportDetailPreview.shift.time}
          </p>
          <p className="mt-0.5 text-sm text-text-tertiary">Created by you · Not saved</p>
        </div>
        <span className="rounded-sm bg-status-warning/12 px-2.5 py-1 text-sm font-medium text-status-warning">
          Draft
        </span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
        <section aria-label="Report entries">
          <div className="overflow-hidden rounded-md bg-card shadow-card">
            {reportSections.map((section) => (
              <div
                key={section.title}
                className="flex min-h-18 items-center gap-3 border-b border-border/60 px-4 py-3 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="font-medium text-text-heading">{section.title}</h2>
                  <p className="text-sm text-text-tertiary">{section.description}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  disabled
                  className="gap-1 px-2 text-primary"
                  aria-label={`${section.action} ${section.title} is not available`}
                >
                  {section.action}
                  <ChevronRight aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-text-tertiary">
            Report entry forms are not available in this UI preview.
          </p>
        </section>

        <ContentSection label="Summary">
          <dl className="rounded-md bg-card px-4 py-2 shadow-card">
            <div className="flex min-h-11 items-center justify-between gap-4 border-b border-border/60">
              <dt>Sales</dt>
              <dd aria-label="Sales not calculated" className="font-medium tabular-nums">
                —
              </dd>
            </div>
            <div className="flex min-h-11 items-center justify-between gap-4">
              <dt>Expenses</dt>
              <dd aria-label="Expenses not calculated" className="font-medium tabular-nums">
                —
              </dd>
            </div>
          </dl>
        </ContentSection>
      </div>

      <div className="mt-auto pt-6 pb-[env(safe-area-inset-bottom)]">
        <Button type="button" size="lg" className="w-full wide:h-12" disabled>
          Review report
        </Button>
      </div>
    </div>
  )
}
