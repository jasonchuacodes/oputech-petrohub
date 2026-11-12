'use client'

import Decimal from 'decimal.js'
import { Check, ChevronDown, RefreshCw } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useId, useMemo, useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { DateRangePicker } from '~/components/ui/date-range-picker'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import type { FinancialSummaryQuery } from '~/generated/graphql'
import { useFinancialSummaryQuery } from '../../reports/reports.queries'
import {
  financialRangeFromParams,
  localDateFor,
  type FinancialPeriod,
  type FinancialRange,
} from './financial-range'

type FinancialBucket = FinancialSummaryQuery['financialSummary']['buckets'][number]
type FinancialAmounts = FinancialSummaryQuery['financialSummary']['totals']
type FinancialMetric = keyof FinancialAmounts

const metrics: Array<{
  key: FinancialMetric
  label: string
  color: string
  accentClassName: string
}> = [
  { key: 'income', label: 'Income', color: 'var(--primary)', accentClassName: 'bg-primary' },
  { key: 'expenses', label: 'Expenses', color: 'var(--destructive)', accentClassName: 'bg-destructive' },
  {
    key: 'lubricantSales',
    label: 'Lubricant sales',
    color: 'var(--color-status-info)',
    accentClassName: 'bg-status-info',
  },
]

export function FinancialSummary({ tenantId, timezone }: { tenantId: string; timezone: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const range = useMemo(
    () => financialRangeFromParams(searchParams, timezone),
    [searchParams, timezone],
  )
  const summary = useFinancialSummaryQuery(tenantId, {
    startDate: range.startDate,
    endDate: range.endDate,
  })
  const today = localDateFor(timezone)

  const replacePeriod = (period: Exclude<FinancialPeriod, 'custom'>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('financePeriod', period)
    params.delete('financeStart')
    params.delete('financeEnd')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const replaceCustomRange = (startDate: string, endDate: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('financePeriod', 'custom')
    params.set('financeStart', startDate)
    params.set('financeEnd', endDate)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <section aria-label="Financial summary" className="flex flex-col gap-2">
      <div className="flex justify-end">
        <PeriodDropdown
          range={range}
          timezone={timezone}
          today={today}
          disabled={summary.isFetching}
          onPeriodChange={replacePeriod}
          onCustomApply={replaceCustomRange}
        />
      </div>

      {summary.isPending ? (
        <FinancialSummarySkeleton />
      ) : summary.isError && !summary.data ? (
        <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
          <p className="text-sm text-text-secondary">Unable to load the financial summary.</p>
          <Button type="button" variant="outline" onClick={() => void summary.refetch()}>
            <RefreshCw aria-hidden="true" /> Try again
          </Button>
        </div>
      ) : summary.data ? (
        <div className="flex flex-col gap-2">
          {summary.isRefetchError && (
            <p className="text-sm text-status-warning">
              Unable to refresh. Showing the last available summary.
            </p>
          )}
          <div className="grid gap-3 md:grid-cols-3">
            {metrics.map((metric) => (
              <MetricGraph
                key={metric.key}
                metric={metric}
                total={summary.data.totals[metric.key]}
                buckets={summary.data.buckets}
                currency={summary.data.currency}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function PeriodDropdown({
  range,
  timezone,
  today,
  disabled,
  onPeriodChange,
  onCustomApply,
}: {
  range: FinancialRange
  timezone: string
  today: string
  disabled: boolean
  onPeriodChange: (period: Exclude<FinancialPeriod, 'custom'>) => void
  onCustomApply: (startDate: string, endDate: string) => void
}) {
  const [customOpen, setCustomOpen] = useState(false)
  const openCustomAfterClose = useRef(false)
  const periodTriggerRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            ref={periodTriggerRef}
            type="button"
            disabled={disabled}
            aria-label="Select financial summary date range"
            className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-sm px-1 text-left whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50"
          >
            <span className="text-xs text-text-tertiary">Period</span>
            <span className="truncate text-sm font-medium text-text-heading tabular-nums">
              {formatIndicatorDate(range.startDate)} – {formatIndicatorDate(range.endDate)}
            </span>
            <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onCloseAutoFocus={(event) => {
            if (!openCustomAfterClose.current) return
            event.preventDefault()
            openCustomAfterClose.current = false
            setCustomOpen(true)
          }}
        >
          <DropdownMenuItem onSelect={() => onPeriodChange('weekly')}>
            <Check aria-hidden="true" className={range.period === 'weekly' ? 'opacity-100' : 'opacity-0'} />
            This week
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onPeriodChange('monthly')}>
            <Check aria-hidden="true" className={range.period === 'monthly' ? 'opacity-100' : 'opacity-0'} />
            This month
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => { openCustomAfterClose.current = true }}>
            <Check aria-hidden="true" className={range.period === 'custom' ? 'opacity-100' : 'opacity-0'} />
            Custom
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DateRangePicker
        startDate={range.startDate}
        endDate={range.endDate}
        timezone={timezone}
        maxDate={today}
        disabled={disabled}
        open={customOpen}
        hideTrigger
        anchorRef={periodTriggerRef}
        onOpenChange={setCustomOpen}
        onApply={onCustomApply}
      />
    </div>
  )
}

function MetricGraph({
  metric,
  total,
  buckets,
  currency,
}: {
  metric: (typeof metrics)[number]
  total: string
  buckets: FinancialBucket[]
  currency: string
}) {
  const titleId = useId()
  const width = 260
  const height = 78
  const padding = 5
  const plotWidth = width - padding * 2
  const plotHeight = height - padding * 2
  const values = buckets.map((bucket) => chartNumber(bucket.amounts[metric.key]))
  const maximum = Math.max(0, ...values)
  const points = values.map((value, index) => ({
    x: values.length === 1
      ? width / 2
      : padding + (index / Math.max(1, values.length - 1)) * plotWidth,
    y: padding + plotHeight - (maximum === 0 ? 0 : value / maximum) * plotHeight,
  }))
  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  return (
    <article className="overflow-hidden rounded-md bg-card p-4 shadow-card">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className={`size-2 rounded-full ${metric.accentClassName}`} />
          <h3 id={titleId} className="text-sm text-text-secondary">{metric.label}</h3>
        </div>
        <p className="font-semibold text-text-heading tabular-nums">{formatCurrency(total, currency)}</p>
      </header>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby={titleId}
        className="mt-3 h-20 w-full"
        preserveAspectRatio="none"
      >
        <line
          x1={padding}
          x2={width - padding}
          y1={height - padding}
          y2={height - padding}
          stroke="var(--border)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={path}
          fill="none"
          stroke={metric.color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {points.length === 1 && points[0] && (
          <circle
            cx={points[0].x}
            cy={points[0].y}
            r="3"
            fill="var(--card)"
            stroke={metric.color}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>

      <ul className="sr-only">
        {buckets.map((bucket) => (
          <li key={`${metric.key}:${bucket.startDate}:${bucket.endDate}`}>
            {bucket.startDate} to {bucket.endDate}: {formatCurrency(bucket.amounts[metric.key], currency)}.
          </li>
        ))}
      </ul>
    </article>
  )
}

export function FinancialSummarySkeleton() {
  return (
    <section aria-label="Loading financial summary" className="flex flex-col gap-2">
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-md bg-card shadow-card" />
        ))}
      </div>
    </section>
  )
}

function chartNumber(value: string): number {
  const amount = new Decimal(value).toNumber()
  return Number.isFinite(amount) && amount > 0 ? amount : 0
}

function formatIndicatorDate(value: string): string {
  const [year, month, day] = value.split('-')
  return `${month}/${day}/${year}`
}

function formatCurrency(value: string, currency: string): string {
  const [wholeWithSign, fraction] = new Decimal(value).toFixed(2).split('.') as [string, string]
  const negative = wholeWithSign.startsWith('-')
  const whole = negative ? wholeWithSign.slice(1) : wholeWithSign
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const parts = formatter.formatToParts(1234.5)
  const group = parts.find((part) => part.type === 'group')?.value ?? ','
  const decimalSeparator = parts.find((part) => part.type === 'decimal')?.value ?? '.'
  const firstNumber = parts.findIndex((part) => part.type === 'integer')
  const lastNumber = parts.findLastIndex((part) => part.type === 'fraction')
  const prefix = parts.slice(0, firstNumber).filter((part) => part.type !== 'minusSign').map((part) => part.value).join('')
  const suffix = parts.slice(lastNumber + 1).map((part) => part.value).join('')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, group)
  return `${negative ? '-' : ''}${prefix}${grouped}${decimalSeparator}${fraction}${suffix}`
}
