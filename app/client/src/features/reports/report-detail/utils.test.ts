import { describe, expect, it } from 'vitest';
import type { ReportDetailRecord } from '../reports.queries';
import {
  calculatePreview,
  formatCurrentReading,
  formatMoney,
  formatReading,
  toFormValues,
  toSaveInput,
} from './utils';

function createReport(): ReportDetailRecord {
  return {
    id: 'report-1',
    businessDate: '2026-11-11',
    shiftId: 'shift-1',
    interval: { startTime: '06:00', endTime: '14:00', timezone: 'Asia/Manila' },
    creatorId: 'user-1',
    creatorName: 'Operator',
    status: 'draft',
    revision: 3,
    createdAt: '2026-11-11T06:00:00.000Z',
    updatedAt: '2026-11-11T06:00:00.000Z',
    submittedAt: null,
    submittedById: null,
    submittedByName: null,
    revokedAt: null,
    revokedByName: null,
    revocationReason: null,
    currency: 'PHP',
    legacy: false,
    effective: true,
    revokedFromStatus: null,
    revokedById: null,
    incomeEntries: [],
    expenseEntries: [],
    lubricantSales: [],
    totals: {
      income: '0.00',
      expenses: '0.00',
      cashFuelSales: '0.00',
      pumpSales: null,
      overShort: null,
      lubricantSales: '0.00',
    },
    disposals: {
      id: 'disposal-1',
      revision: 2,
      status: 'draft',
      predecessorBatchId: null,
      successorBatchId: null,
      pumpSales: null,
      complete: false,
      blockingIssues: [],
      readings: [
        {
          meterId: 'meter-1',
          meterLabel: 'Pump 1',
          productId: 'product-1',
          productName: 'ADO',
          unitPrice: '94.10',
          openingReading: '100.000',
          openingSource: 'baseline',
          closingReading: null,
          calibration: '2.000',
          netVolume: null,
          sales: null,
        },
      ],
    },
  };
}

describe('report detail formatting', () => {
  it('formats currency and readings', () => {
    expect(formatMoney('1234.1')).toBe('₱1,234.10');
    expect(formatMoney('0')).toBe('₱0.00');
    expect(formatMoney('')).toBe('₱0.00');
    expect(formatReading('0')).toBe('0.000');
    expect(formatCurrentReading('0')).toBe('0.000');
    expect(formatCurrentReading('110.5')).toBe('110.500');
  });

  it('handles missing and invalid draft readings safely', () => {
    expect(formatCurrentReading('')).toBe('—');
    expect(formatCurrentReading(null)).toBe('—');
    expect(formatCurrentReading('invalid')).toBe('invalid');
  });
});

describe('disposal preview', () => {
  it('adds cash income and expenses when calculating cash fuel sales', () => {
    const preview = calculatePreview(createReport(), {
      incomeEntries: [{ amount: '1000.00' }],
      expenseEntries: [{ amount: '100.00' }],
      disposalReadings: [{ closingReading: '110.000', calibration: '2.000' }],
    });

    expect(preview.cashFuelSales).toBe('1100.00');
    expect(preview.overShort).toBe('347.20');
  });

  it('subtracts calibration before computing sales', () => {
    const preview = calculatePreview(createReport(), {
      disposalReadings: [
        { closingReading: '110.000', calibration: '2.000' },
      ],
    });

    expect(preview.readings[0]).toEqual({ net: '8.000', sales: '752.80' });
    expect(preview.pumpSales).toBe('752.80');
  });

  it('treats a zero closing reading as complete when the meter opens at zero', () => {
    const report = createReport();
    if (!report.disposals) throw new Error('Expected disposal readings');
    report.disposals.readings[0].openingReading = '0';

    const preview = calculatePreview(report, {
      disposalReadings: [{ closingReading: '0', calibration: '0' }],
    });

    expect(preview.complete).toBe(true);
    expect(preview.readings[0]).toEqual({ net: '0.000', sales: '0.00' });
    expect(preview.pumpSales).toBe('0.00');
    expect(preview.overShort).toBe('0.00');
  });

  it('keeps invalid disposal values incomplete', () => {
    const preview = calculatePreview(createReport(), {
      disposalReadings: [
        { closingReading: '101.000', calibration: '2.000' },
      ],
    });

    expect(preview.complete).toBe(false);
    expect(preview.readings[0]).toEqual({});
    expect(preview.pumpSales).toBeUndefined();
  });
});

describe('lubricant sales', () => {
  it('keeps lubricant sales separate from cash fuel sales', () => {
    const preview = calculatePreview(createReport(), {
      incomeEntries: [{ amount: '1000.00' }],
      expenseEntries: [{ amount: '100.00' }],
      lubricantSales: [{ amount: '250.00' }],
    });
    expect(preview.cashFuelSales).toBe('1100.00');
    expect(preview.lubricantSales).toBe('250.00');
  });
});

describe('disposal form mapping', () => {
  it('preserves calibration and maps a cleared current reading to null', () => {
    const report = createReport();
    const values = toFormValues(report);
    expect(values.disposalReadings[0]).toEqual({
      meterId: 'meter-1',
      closingReading: '',
      calibration: '2.000',
    });

    const input = toSaveInput(report, values);
    expect(input.disposalReadings[0]).toEqual({
      meterId: 'meter-1',
      closingReading: null,
      calibration: '2.000',
    });
  });

  it('preserves a zero current reading in form and save values', () => {
    const report = createReport();
    if (!report.disposals) throw new Error('Expected disposal readings');
    report.disposals.readings[0].closingReading = '0';
    report.disposals.readings[0].calibration = '0';

    const values = toFormValues(report);
    expect(values.disposalReadings[0]?.closingReading).toBe('0');
    expect(toSaveInput(report, values).disposalReadings[0]?.closingReading).toBe('0');
  });

  it('preserves recurring income provenance locally but excludes it from save input', () => {
    const report = createReport();
    report.incomeEntries = [{
      id: 'income-1',
      recurringIncomeFieldId: 'recurring-1',
      description: 'PayMaya',
      notes: null,
      amount: '0',
    }];

    const values = toFormValues(report);
    expect(values.incomeEntries[0].recurringIncomeFieldId).toBe('recurring-1');
    expect(values.incomeEntries[0].amount).toBe('');
    expect(toSaveInput(report, values).incomeEntries[0]).toEqual({
      id: 'income-1',
      description: 'PayMaya',
      notes: null,
      amount: '0',
    });
  });
});
