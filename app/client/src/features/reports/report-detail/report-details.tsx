'use client';

import Decimal from 'decimal.js';
import { CirclePlus, Droplet, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { cn } from '~/utils/cn';
import type { ReportDetailRecord } from '../reports.queries';
import { FinancialEntrySheet } from './financial-entry-sheet';
import { useReportEditor } from './report-editor-context';
import { formatMoney } from './utils';

export function ReportDetailsPanel() {
  const { canEdit, financialEntryEditor, financialEntryTarget, closeFinancialEntry } =
    useReportEditor();

  return (
    <div role="tabpanel" className="mt-5 flex flex-col gap-5 pb-5">
      <SummaryCard />
      {canEdit && <FinancialShortcuts />}
      <FinancialSection kind="income" />
      <FinancialSection kind="expense" />
      {financialEntryEditor.open && financialEntryTarget && (
        <FinancialEntrySheet
          key={`${financialEntryTarget.kind}:${financialEntryTarget.index ?? 'new'}`}
          kind={financialEntryTarget.kind}
          index={financialEntryTarget.index}
          onClose={closeFinancialEntry}
        />
      )}
    </div>
  );
}

function FinancialShortcuts() {
  const { openFinancialEntry } = useReportEditor();

  return (
    <section aria-label="Report shortcuts">
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          className="flex min-h-24 flex-col items-center justify-start gap-2 rounded-md bg-card px-2 py-3 text-center shadow-card outline-none transition-shadow hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/30"
          onClick={() => openFinancialEntry('income')}
        >
          <span className="flex size-11 items-center justify-center rounded-full border border-primary/25 text-primary">
            <Plus aria-hidden="true" className="size-6" />
          </span>
          <span className="text-xs font-medium text-primary">Add income</span>
        </button>
        <button
          type="button"
          className="flex min-h-24 flex-col items-center justify-start gap-2 rounded-md bg-card px-2 py-3 text-center shadow-card outline-none transition-shadow hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/30"
          onClick={() => openFinancialEntry('expense')}
        >
          <span className="flex size-11 items-center justify-center rounded-full border border-primary/25 text-primary">
            <Minus aria-hidden="true" className="size-6" />
          </span>
          <span className="text-xs font-medium text-primary">Add expense</span>
        </button>
        <button
          type="button"
          disabled
          className="flex min-h-24 cursor-not-allowed flex-col items-center justify-start gap-2 rounded-md bg-card px-2 py-3 text-center opacity-50 shadow-card outline-none"
        >
          <span className="flex size-11 items-center justify-center rounded-full border border-primary/25 text-primary">
            <Droplet aria-hidden="true" className="size-6" />
          </span>
          <span className="text-xs font-medium text-primary">Add lubes</span>
        </button>
      </div>
    </section>
  );
}

type EntryField = {
  id: string;
  fieldKey: string;
  description: string;
  notes: string;
  amount: string;
};

function FinancialSection({ kind }: { kind: 'income' | 'expense' }) {
  const { canEdit, income, expenses, preview, openFinancialEntry } = useReportEditor();
  const title = kind === 'income' ? 'Income' : 'Expense';
  const fieldArray = kind === 'income' ? income : expenses;
  const fields: EntryField[] = fieldArray.fields;
  const total = kind === 'income' ? preview.income : preview.expenses;

  return (
    <section>
      <div className="flex min-h-10 items-center justify-between">
        <h2 className="font-sans text-sm font-semibold tracking-[0.14em] text-text-heading uppercase">
          {title}
        </h2>
      </div>
      <div className="overflow-hidden rounded-md bg-card px-4 shadow-card">
        {fields.map((field, index) =>
          canEdit ? (
            <div
              key={field.fieldKey}
              className="grid grid-cols-[minmax(0,1fr)_minmax(7rem,0.8fr)_2.75rem] items-center gap-3 border-b border-border/60 py-3"
            >
              <Input
                readOnly
                aria-label={`${title} description: ${field.description}`}
                value={field.description}
                className="cursor-pointer hover:bg-surface-hover"
                onClick={() => openFinancialEntry(kind, index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ')
                    openFinancialEntry(kind, index);
                }}
              />
              <Input
                readOnly
                aria-label={`${title} amount: ${formatMoney(field.amount)}`}
                value={formatMoney(field.amount)}
                className="cursor-pointer text-right font-medium tabular-nums hover:bg-surface-hover"
                onClick={() => openFinancialEntry(kind, index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ')
                    openFinancialEntry(kind, index);
                }}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={`Remove ${field.description}`}
                onClick={() => fieldArray.remove(index)}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <div
              key={field.fieldKey}
              className="flex min-h-14 items-center justify-between gap-4 border-b border-border/60 py-3"
            >
              <span className="min-w-0 text-text-heading">{field.description}</span>
              <span className="shrink-0 text-right font-medium tabular-nums text-text-heading">
                {formatMoney(field.amount)}
              </span>
            </div>
          ),
        )}
        {fields.length === 0 && (
          <p className="py-4 text-sm text-text-tertiary">No {kind} entries.</p>
        )}
        {canEdit && (
          <button
            type="button"
            className="flex min-h-12 w-full items-center gap-2 border-b border-border/60 text-sm font-medium text-status-success"
            onClick={() => openFinancialEntry(kind)}
          >
            <CirclePlus aria-hidden="true" className="size-5" />
            Add {kind}
          </button>
        )}
        <div className="flex min-h-14 items-center justify-between font-medium">
          <span>Total {kind}</span>
          <span className="tabular-nums">{formatMoney(total)}</span>
        </div>
      </div>
    </section>
  );
}

export function SummaryCard({ compact = false }: { compact?: boolean }) {
  const { preview, report } = useReportEditor();
  const difference = new Decimal(preview.overShort ?? 0);
  const label = difference.isZero() ? 'Balanced' : difference.isPositive() ? 'Over' : 'Short';

  return (
    <section className={cn('overflow-hidden rounded-md bg-card', !compact && 'shadow-card')}>
      <div className={compact ? 'p-3' : 'p-4'}>
        {!compact && (
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-text-heading">Summary</h2>
            <ReportStatusBadge status={report.status} />
          </div>
        )}
        <div className={!compact ? 'mt-3' : undefined}>
          <SummaryRow label="Cash fuel sales" value={formatMoney(preview.cashFuelSales)} />
          <SummaryRow label="Income" value={formatMoney(preview.income)} nested />
          <SummaryRow label="Expenses" value={formatMoney(preview.expenses)} nested />
          <div className="my-2 border-y border-border/60">
            <SummaryRow
              label="Pump sales"
              value={preview.pumpSales ? formatMoney(preview.pumpSales) : '—'}
            />
          </div>
          <SummaryRow
            label={preview.pumpSales ? label : 'Over / Short'}
            value={preview.overShort ? formatMoney(difference.abs().toFixed(2)) : '—'}
            tone={
              preview.overShort
                ? difference.isNegative()
                  ? 'danger'
                  : difference.isPositive()
                    ? 'success'
                    : undefined
                : undefined
            }
          />
        </div>
      </div>
      {!compact && (
        <footer className="border-t border-border/60 px-4 py-3">
          <p className="text-sm text-text-secondary">
            Created by <span className="font-medium text-text-heading">{report.creatorName}</span>
          </p>
        </footer>
      )}
    </section>
  );
}

function ReportStatusBadge({ status }: { status: ReportDetailRecord['status'] }) {
  const label = status === 'submitted' ? 'Submitted' : status === 'revoked' ? 'Revoked' : 'Draft';

  return (
    <span
      className={cn(
        'rounded-sm px-2.5 py-1 text-xs font-medium',
        status === 'submitted'
          ? 'bg-status-success/12 text-status-success'
          : status === 'revoked'
            ? 'bg-status-error/12 text-status-error'
            : 'bg-status-warning/12 text-status-warning',
      )}
    >
      {label}
    </span>
  );
}

function SummaryRow({
  label,
  value,
  nested = false,
  tone,
}: {
  label: string;
  value: string;
  nested?: boolean;
  tone?: 'danger' | 'success';
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
  );
}
