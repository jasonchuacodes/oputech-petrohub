import Decimal from 'decimal.js'
import { cn } from '~/utils/cn'
import { formatMoney } from './utils'

export type ReportSummaryValues = {
  income: string
  expenses: string
  cashFuelSales: string
  lubricantSales: string
  pumpSales?: string | null
  overShort?: string | null
}

export function ReportSummaryRows({
  summary,
  className,
}: {
  summary: ReportSummaryValues
  className?: string
}) {
  const difference = new Decimal(summary.overShort ?? 0)
  const label = difference.isZero() ? 'Balanced' : difference.isPositive() ? 'Over' : 'Short'
  const hasPumpSales = summary.pumpSales !== undefined && summary.pumpSales !== null
  const hasOverShort = summary.overShort !== undefined && summary.overShort !== null

  return (
    <div className={className}>
      <SummaryRow label="Cash fuel sales" value={formatMoney(summary.cashFuelSales)} />
      <SummaryRow label="Income" value={formatMoney(summary.income)} nested />
      <SummaryRow label="Expenses" value={formatMoney(summary.expenses)} nested />
      <SummaryRow label="Lubricant sales" value={formatMoney(summary.lubricantSales)} />
      <div className="my-2 border-y border-border/60">
        <SummaryRow label="Pump sales" value={hasPumpSales ? formatMoney(summary.pumpSales ?? '0') : '—'} />
      </div>
      <SummaryRow
        label={hasPumpSales ? label : 'Over / Short'}
        value={hasOverShort ? formatMoney(difference.abs().toFixed(2)) : '—'}
        tone={
          hasOverShort
            ? difference.isNegative()
              ? 'danger'
              : difference.isPositive()
                ? 'success'
                : undefined
            : undefined
        }
      />
    </div>
  )
}

function SummaryRow({
  label,
  value,
  nested = false,
  tone,
}: {
  label: string
  value: string
  nested?: boolean
  tone?: 'danger' | 'success'
}) {
  return (
    <div
      className={cn(
        'flex min-h-10 items-center justify-between gap-4',
        nested && 'min-h-9 pl-4 text-sm text-text-secondary',
        tone === 'danger' && 'text-destructive',
        tone === 'success' && 'text-status-success',
      )}
    >
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}
