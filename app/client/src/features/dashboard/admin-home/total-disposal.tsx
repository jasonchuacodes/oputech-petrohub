import { ContentSection } from '~/components/ui/content-section'
import type { FinancialSummaryQuery } from '~/generated/graphql'
import { formatDisposalVolume } from '../../reports/report-detail/utils'

type DisposalTotal = FinancialSummaryQuery['financialSummary']['disposalTotals'][number]

export function TotalDisposal({
  totals,
  pending = false,
}: {
  totals: readonly DisposalTotal[]
  pending?: boolean
}) {
  const hasUnavailableTotals = totals.some((item) => item.netVolume === null)

  return (
    <ContentSection
      label="Total disposal"
      headingClassName="font-sans text-sm font-semibold tracking-[0.14em] uppercase"
    >
      {pending ? (
        <DisposalCardsSkeleton />
      ) : totals.length === 0 ? (
        <div className="flex min-h-28 items-center justify-center rounded-md bg-card p-6 text-center shadow-card">
          <p className="text-sm text-text-secondary">No active fuel products.</p>
        </div>
      ) : (
        <>
          {hasUnavailableTotals && (
            <p className="mb-2 text-sm text-status-warning">
              Some totals are unavailable because submitted disposal data is incomplete.
            </p>
          )}
          <div className="overflow-hidden rounded-md bg-border/60 shadow-card md:overflow-visible md:rounded-none md:bg-transparent md:shadow-none">
            <div className="grid grid-cols-1 gap-px md:grid-cols-[repeat(auto-fit,minmax(min(12rem,100%),1fr))] md:gap-3">
              {totals.map((item) => (
                <article
                  key={item.productId}
                  className="flex min-h-20 min-w-0 flex-col justify-center bg-card px-3 py-3 md:rounded-md md:shadow-card"
                >
                  <h3 title={item.productName} className="truncate text-sm font-medium text-text-heading">
                    {item.productName}
                  </h3>
                  <p className="mt-0.5 font-semibold tabular-nums text-text-heading">
                    {formatDisposalVolume(item.netVolume)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </>
      )}
    </ContentSection>
  )
}

function DisposalCardsSkeleton() {
  return (
    <div className="overflow-hidden rounded-md bg-border/60 shadow-card md:overflow-visible md:rounded-none md:bg-transparent md:shadow-none">
      <div className="grid grid-cols-1 gap-px md:grid-cols-3 md:gap-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-20 animate-pulse bg-card md:rounded-md md:shadow-card" />
        ))}
      </div>
    </div>
  )
}
