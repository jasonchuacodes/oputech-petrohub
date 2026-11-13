'use client';

import Decimal from 'decimal.js';
import { MoreVertical } from 'lucide-react';
import { useCallback, useRef, useState, type MouseEvent } from 'react';
import { useWatch } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { ContentSection } from '~/components/ui/content-section';
import { summarizeDisposalsByProduct } from '../disposal-summary';
import { DisposalReadingSheet } from './disposal-reading-sheet';
import { useReportEditor } from './report-editor-context';
import { formatCurrentReading, formatDisposalVolume, formatMoney, formatReading } from './utils';

export function ReportDisposalsPanel() {
  const { report, form, preview } = useReportEditor();
  const readings = report.disposals?.readings ?? [];
  const formReadings = useWatch({ control: form.control, name: 'disposalReadings' });
  const [selectedMeterId, setSelectedMeterId] = useState<string>();
  const sheetTriggerRef = useRef<HTMLElement | null>(null);
  const selectedIndex = readings.findIndex((reading) => reading.meterId === selectedMeterId);
  const selectedReading = selectedIndex >= 0 ? readings[selectedIndex] : undefined;
  const disposalSummary = summarizeDisposalsByProduct(
    readings.map((reading, index) => ({
      productId: reading.productId,
      productName: reading.productName,
      netVolume: preview.readings[index]?.net,
    })),
  );

  const openReading = useCallback((meterId: string, event: MouseEvent<HTMLElement>) => {
    sheetTriggerRef.current = event.currentTarget;
    setSelectedMeterId(meterId);
  }, []);
  const closeReading = useCallback(() => setSelectedMeterId(undefined), []);

  return (
    <div role="tabpanel" className="mt-5">
      {readings.length > 0 ? (
        <div className="flex flex-col gap-5">
          <ContentSection label="Disposal summary">
            <dl className="divide-y divide-border/60 rounded-md bg-card px-4 shadow-card">
              {disposalSummary.map((item) => (
                <div key={item.productId} className="flex min-h-12 items-center justify-between gap-4 py-2">
                  <dt className="font-medium text-text-heading">{item.productName}</dt>
                  <dd className="text-right font-semibold tabular-nums text-text-heading">
                    {formatDisposalVolume(item.netVolume)}
                  </dd>
                </div>
              ))}
            </dl>
          </ContentSection>

          <div className="flex flex-col gap-3">
            {readings.map((reading, index) => {
              const formReading = formReadings[index];
              const calculated = preview.readings[index];
              const showCalibration = hasCalibration(formReading?.calibration);
              const fieldError =
                form.formState.errors.disposalReadings?.[index]?.closingReading ??
                form.formState.errors.disposalReadings?.[index]?.calibration;

              return (
                <article
                  key={reading.meterId}
                  className="relative cursor-pointer rounded-md bg-card p-4 shadow-card transition-colors hover:bg-surface-hover"
                >
                  <button
                    type="button"
                    aria-label={`View disposal details for ${reading.meterLabel}`}
                    aria-haspopup="dialog"
                    className="absolute inset-0 z-0 rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/40"
                    onClick={(event) => openReading(reading.meterId, event)}
                  />
                  <div className="pointer-events-none relative z-10">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-semibold text-text-heading">
                          {reading.meterLabel}
                        </h2>
                        <p className="mt-1 text-base font-medium text-text-secondary">
                          {reading.productName}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label={`Open disposal details for ${reading.meterLabel}`}
                        aria-haspopup="dialog"
                        className="pointer-events-auto -mr-2 -mt-1"
                        onClick={(event) => openReading(reading.meterId, event)}
                      >
                        <MoreVertical aria-hidden="true" />
                      </Button>
                    </div>

                    <div className="mt-4 divide-y divide-border/60 border-t border-border/60">
                      <Metric
                        label="After reading"
                        value={formatCurrentReading(formReading?.closingReading)}
                        emphasis="primary"
                      />
                      <Metric label="Before reading" value={formatReading(reading.openingReading)} />
                      {showCalibration && (
                        <Metric
                          label="Calibration"
                          value={formatCurrentReading(formReading?.calibration)}
                          emphasis="secondary"
                        />
                      )}
                      <Metric
                        label="Disposal"
                        value={formatDisposalVolume(calculated?.net)}
                      />
                      <Metric label="Price" value={formatMoney(reading.unitPrice)} />
                      <Metric
                        label="Computed sales"
                        value={calculated?.sales ? formatMoney(calculated.sales) : '—'}
                      />
                    </div>
                    {fieldError && (
                      <p className="mt-3 text-xs text-destructive">{fieldError.message}</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-md bg-card p-5 text-sm text-text-secondary shadow-card">
          No disposal readings are available.
        </div>
      )}

      {selectedReading && (
        <DisposalReadingSheet
          key={selectedReading.meterId}
          reading={selectedReading}
          index={selectedIndex}
          onClose={closeReading}
          returnFocusRef={sheetTriggerRef}
        />
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  emphasis = 'default',
}: {
  label: string;
  value: string;
  emphasis?: 'primary' | 'default' | 'secondary';
}) {
  const valueClass =
    emphasis === 'primary'
      ? 'text-metric-md font-semibold text-text-heading'
      : emphasis === 'secondary'
        ? 'font-medium text-text-secondary'
        : 'font-semibold text-text-heading';

  return (
    <div className={`flex items-center justify-between gap-4 py-2 ${emphasis === 'primary' ? 'min-h-14' : 'min-h-12'}`}>
      <span className="text-sm text-text-secondary">{label}</span>
      <span className={`text-right tabular-nums ${valueClass}`}>{value}</span>
    </div>
  );
}

function hasCalibration(value?: string) {
  if (!value) return false;
  try {
    return new Decimal(value).greaterThan(0);
  } catch {
    return true;
  }
}
