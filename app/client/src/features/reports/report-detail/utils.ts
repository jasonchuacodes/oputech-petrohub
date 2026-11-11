import Decimal from 'decimal.js';
import type { ReportDetailRecord } from '../reports.queries';
import type { ReportDetailFormValues } from './report-detail.schema';

export type ReportPreview = {
  income: string;
  expenses: string;
  cashFuelSales: string;
  pumpSales?: string;
  overShort?: string;
  complete: boolean;
  readings: Array<{ net?: string; sales?: string }>;
};

type PreviewValues = {
  incomeEntries?: Array<{ amount?: string }>;
  expenseEntries?: Array<{ amount?: string }>;
  disposalReadings?: Array<{ closingReading?: string; calibration?: string }>;
};

export function cloneFormValues(values: ReportDetailFormValues): ReportDetailFormValues {
  return {
    incomeEntries: values.incomeEntries.map((entry) => ({ ...entry })),
    expenseEntries: values.expenseEntries.map((entry) => ({ ...entry })),
    disposalReadings: values.disposalReadings.map((reading) => ({ ...reading })),
  };
}

export function formValuesEqual(left: ReportDetailFormValues, right: ReportDetailFormValues) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function toFormValues(report: ReportDetailRecord): ReportDetailFormValues {
  return {
    incomeEntries: report.incomeEntries.map((entry) => ({ ...entry, notes: entry.notes ?? '' })),
    expenseEntries: report.expenseEntries.map((entry) => ({ ...entry, notes: entry.notes ?? '' })),
    disposalReadings:
      report.disposals?.readings.map((reading) => ({
        meterId: reading.meterId,
        closingReading: reading.closingReading ?? '',
        calibration: reading.calibration,
      })) ?? [],
  };
}

export function toSaveInput(report: ReportDetailRecord, values: ReportDetailFormValues) {
  if (!report.disposals) throw new Error('Disposal readings are unavailable');
  return {
    reportId: report.id,
    expectedReportRevision: report.revision,
    expectedDisposalRevision: report.disposals.revision,
    incomeEntries: values.incomeEntries.map((entry) => ({ ...entry, notes: entry.notes || null })),
    expenseEntries: values.expenseEntries.map((entry) => ({
      ...entry,
      notes: entry.notes || null,
    })),
    disposalReadings: values.disposalReadings.map((reading) => ({
      ...reading,
      closingReading: reading.closingReading || null,
    })),
  };
}

export function calculatePreview(
  report: ReportDetailRecord,
  values: PreviewValues,
): ReportPreview {
  const income = addAmounts(values.incomeEntries);
  const expenses = addAmounts(values.expenseEntries);
  const cashFuelSales = income.plus(expenses);
  let complete = Boolean(report.disposals?.readings.length);
  const readings = (report.disposals?.readings ?? []).map((reading, index) => {
    try {
      const value = values.disposalReadings?.[index];
      if (!value?.closingReading) {
        complete = false;
        return {};
      }
      const gross = new Decimal(value.closingReading).minus(reading.openingReading);
      const net = gross.minus(value.calibration || 0);
      if (gross.isNegative() || net.isNegative()) {
        complete = false;
        return {};
      }
      return {
        net: net.toFixed(3),
        sales: net.times(reading.unitPrice).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2),
      };
    } catch {
      complete = false;
      return {};
    }
  });
  const pumpSales = complete
    ? readings.reduce((total, reading) => total.plus(reading.sales ?? 0), new Decimal(0))
    : undefined;
  return {
    income: income.toFixed(2),
    expenses: expenses.toFixed(2),
    cashFuelSales: cashFuelSales.toFixed(2),
    pumpSales: pumpSales?.toFixed(2),
    overShort: pumpSales ? cashFuelSales.minus(pumpSales).toFixed(2) : undefined,
    complete,
    readings,
  };
}

function addAmounts(entries?: Array<{ amount?: string }>) {
  return (entries ?? []).reduce((total, entry) => {
    try {
      return entry.amount ? total.plus(entry.amount) : total;
    } catch {
      return total;
    }
  }, new Decimal(0));
}

export function formatMoney(value: string) {
  const [whole, fraction = '00'] = new Decimal(value).toFixed(2).split('.');
  return `₱${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${fraction}`;
}

export function formatReading(value: string) {
  return new Decimal(value).toFixed(3);
}

export function formatCurrentReading(value?: string | null) {
  if (!value) return '—';
  try {
    return formatReading(value);
  } catch {
    return value;
  }
}
