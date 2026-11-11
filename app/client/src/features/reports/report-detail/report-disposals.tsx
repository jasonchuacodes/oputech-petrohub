'use client';

import type { ReactNode } from 'react';
import { Input } from '~/components/ui/input';
import { cn } from '~/utils/cn';
import { useReportEditor } from './report-editor-context';
import { formatMoney, formatReading } from './utils';

export function ReportDisposalsPanel() {
  const { report, form, preview, canEdit } = useReportEditor();

  return (
    <div role="tabpanel" className="mt-5 flex flex-col gap-3">
      {report.disposals?.readings.map((reading, index) => {
        const calculated = preview.readings[index];
        return (
          <section key={reading.meterId} className="rounded-md bg-card p-4 shadow-card">
            <div className="mb-3">
              <h2 className="font-medium text-text-heading">{reading.meterLabel}</h2>
              <p className="text-sm text-text-tertiary">{reading.productName}</p>
            </div>
            <div className="divide-y divide-border/60">
              <ReadingRow label="Closing reading">
                <Input
                  className="max-w-44 text-right tabular-nums"
                  inputMode="decimal"
                  placeholder="Enter reading"
                  disabled={!canEdit}
                  aria-invalid={Boolean(
                    form.formState.errors.disposalReadings?.[index]?.closingReading,
                  )}
                  {...form.register(`disposalReadings.${index}.closingReading`)}
                />
              </ReadingRow>
              <ReadingRow label="Opening reading">
                <span className="tabular-nums">{formatReading(reading.openingReading)}</span>
              </ReadingRow>
              <p className="-mt-2 pb-3 text-right text-xs text-text-tertiary">
                {reading.openingSource === 'previous_report'
                  ? 'Previous submitted report'
                  : 'Initial configured reading'}
              </p>
              <ReadingRow label="Calibration">
                <Input
                  className="max-w-44 text-right tabular-nums"
                  inputMode="decimal"
                  disabled={!canEdit}
                  {...form.register(`disposalReadings.${index}.calibration`)}
                />
              </ReadingRow>
              <ReadingRow label="Net disposal">
                <span className="tabular-nums">{calculated?.net ?? '—'}</span>
              </ReadingRow>
              <ReadingRow label="Unit price">
                <span className="tabular-nums">{formatMoney(reading.unitPrice)}</span>
              </ReadingRow>
              <ReadingRow label="Sales" strong>
                <span className="tabular-nums">
                  {calculated?.sales ? formatMoney(calculated.sales) : '—'}
                </span>
              </ReadingRow>
            </div>
          </section>
        );
      })}
      {!report.disposals && (
        <div className="rounded-md bg-card p-5 text-sm text-text-secondary shadow-card">
          No disposal readings are available.
        </div>
      )}
    </div>
  );
}

function ReadingRow({
  label,
  children,
  strong = false,
}: {
  label: string;
  children: ReactNode;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex min-h-14 items-center justify-between gap-4 py-2',
        strong && 'font-semibold',
      )}
    >
      <span className="text-text-secondary">{label}</span>
      {children}
    </div>
  );
}
