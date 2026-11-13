'use client'

import { AlertCircle, ChevronRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useId, useRef, useState, type Ref } from 'react'
import { Button } from '~/components/ui/button'
import { ContentSection } from '~/components/ui/content-section'
import type { ReportsQuery } from '~/generated/graphql'
import { formatShiftTime } from '../../reports/create-report-sheet'
import { summarizeDisposalsByProduct } from '../../reports/disposal-summary'
import { ReportSummaryRows } from '../../reports/report-detail/report-summary-rows'
import { formatDisposalVolume } from '../../reports/report-detail/utils'
import { useReportsQuery } from '../../reports/reports.queries'
import { localDateFor } from './financial-range'

type SummaryReport = ReportsQuery['reports']['items'][number]

export function SubmittedReports({ tenantId, timezone }: { tenantId: string; timezone: string }) {
  const today = localDateFor(timezone)
  const reports = useReportsQuery(tenantId, {
    startDate: today,
    endDate: today,
    submittedOnly: true,
    offset: 0,
    limit: 5,
  })

  return (
    <ContentSection
      label="Reports today"
      headingClassName="font-sans text-sm font-semibold tracking-[0.14em] uppercase"
      rightContent={
        <Link
          href="/report"
          className="rounded-sm px-1 py-1 text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          See all
        </Link>
      }
    >
      {reports.isPending ? (
        <SummaryCarouselSkeleton />
      ) : reports.isError && !reports.data ? (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
          <AlertCircle aria-hidden="true" className="size-6 text-destructive" />
          <p className="text-sm text-text-secondary">Unable to load submitted reports.</p>
          <Button type="button" variant="outline" onClick={() => void reports.refetch()}>
            <RefreshCw aria-hidden="true" /> Try again
          </Button>
        </div>
      ) : reports.data?.items.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center rounded-md bg-card p-6 text-center shadow-card">
          <div>
            <p className="font-medium text-text-heading">No submitted reports</p>
            <p className="mt-1 text-sm text-text-secondary">No reports have been submitted.</p>
          </div>
        </div>
      ) : reports.data ? (
        <ReportSummaryCarousel reports={reports.data.items} refreshFailed={reports.isRefetchError} />
      ) : null}
    </ContentSection>
  )
}

function ReportSummaryCarousel({
  reports,
  refreshFailed,
}: {
  reports: SummaryReport[]
  refreshFailed: boolean
}) {
  const radioName = useId()
  const carouselRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const updateActiveIndex = () => {
    const carousel = carouselRef.current
    if (!carousel) return
    const carouselLeft = carousel.getBoundingClientRect().left
    let nearestIndex = 0
    let nearestDistance = Number.POSITIVE_INFINITY
    cardRefs.current.forEach((card, index) => {
      if (!card) return
      const distance = Math.abs(card.getBoundingClientRect().left - carouselLeft)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })
    setActiveIndex(nearestIndex)
  }

  const showReport = (index: number) => {
    const carousel = carouselRef.current
    const card = cardRefs.current[index]
    if (!carousel || !card) return
    const offset = card.getBoundingClientRect().left - carousel.getBoundingClientRect().left
    carousel.scrollTo({ left: carousel.scrollLeft + offset, behavior: 'smooth' })
    setActiveIndex(index)
  }

  return (
    <div>
      {refreshFailed && (
        <p className="mb-2 text-sm text-status-warning">
          Unable to refresh. Showing the last available reports.
        </p>
      )}
      <div
        ref={carouselRef}
        role="list"
        aria-label="Submitted report summaries"
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 overscroll-x-contain"
        onScroll={updateActiveIndex}
      >
        {reports.map((report, index) => (
          <ReportSummaryCard
            key={report.id}
            ref={(element) => {
              cardRefs.current[index] = element
            }}
            report={report}
            fullWidth={reports.length === 1}
          />
        ))}
      </div>
      <div role="radiogroup" aria-label="Choose a submitted report" className="flex justify-center gap-2 pt-2">
        {reports.map((report, index) => (
          <input
            key={report.id}
            type="radio"
            name={radioName}
            checked={activeIndex === index}
            aria-label={`Show submitted report ${index + 1}`}
            className="size-4 cursor-pointer accent-primary"
            onChange={() => showReport(index)}
          />
        ))}
      </div>
    </div>
  )
}

function ReportSummaryCard({
  report,
  ref,
  fullWidth,
}: {
  report: SummaryReport
  ref?: Ref<HTMLElement>
  fullWidth: boolean
}) {
  const disposalSummary = summarizeDisposalsByProduct(report.disposals?.readings ?? [])

  return (
    <article
      ref={ref}
      role="listitem"
      className={`${fullWidth ? 'w-full' : 'w-[min(85vw,22rem)] wide:w-4/5'} shrink-0 snap-start overflow-hidden rounded-md bg-card shadow-card`}
    >
      <header className="flex items-start justify-between gap-3 border-b border-border/60 px-4 py-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-text-heading">{formatShiftTime(report.interval)}</h3>
          <p className="mt-0.5 truncate text-sm text-text-secondary">
            Submitted by {report.submittedByName ?? report.creatorName}
          </p>
        </div>
        <Link
          href={`/report/${report.id}`}
          aria-label={`View ${formatShiftTime(report.interval)} report`}
          className="flex size-9 shrink-0 items-center justify-center rounded-sm text-primary outline-none hover:bg-primary/10 focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <ChevronRight aria-hidden="true" className="size-5" />
        </Link>
      </header>
      <ReportSummaryRows summary={report.totals} className="p-4" />
      <section className="border-t border-border/60 px-4 py-3" aria-label="Disposals">
        <h4 className="text-sm font-semibold text-text-heading">Disposals</h4>
        {disposalSummary.length > 0 ? (
          <dl className="mt-2 divide-y divide-border/60">
            {disposalSummary.map((item) => (
              <div key={item.productId} className="flex min-h-10 items-center justify-between gap-4 py-2">
                <dt className="text-sm text-text-secondary">{item.productName}</dt>
                <dd className="text-right font-semibold tabular-nums text-text-heading">
                  {formatDisposalVolume(item.netVolume)}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-2 text-sm text-text-secondary">No disposal data available.</p>
        )}
      </section>
    </article>
  )
}

function SummaryCarouselSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden" aria-label="Loading submitted reports">
      {Array.from({ length: 2 }, (_, cardIndex) => (
        <div
          key={cardIndex}
          className="w-[min(85vw,22rem)] shrink-0 overflow-hidden rounded-md bg-card shadow-card wide:w-4/5"
        >
          <div className="border-b border-border/60 px-4 py-3">
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-3 w-36 animate-pulse rounded bg-muted" />
          </div>
          <div className="grid grid-cols-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="border-b border-r border-border/60 p-3">
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-4 w-24 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
          <div className="border-t border-border/60 px-4 py-3">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            {Array.from({ length: 2 }, (_, index) => (
              <div key={index} className="mt-3 flex items-center justify-between gap-4">
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
