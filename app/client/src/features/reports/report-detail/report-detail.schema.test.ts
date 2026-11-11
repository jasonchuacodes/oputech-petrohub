import { describe, expect, it } from 'vitest';
import { reportDetailFormSchema } from './report-detail.schema';

function values(closingReading: string, calibration = '0') {
  return {
    incomeEntries: [],
    expenseEntries: [],
    disposalReadings: [{ meterId: 'meter-1', closingReading, calibration }],
  };
}

describe('report detail disposal readings', () => {
  it.each(['', '0', '10', '10.1', '10.123'])('accepts current reading %j', (reading) => {
    expect(reportDetailFormSchema.safeParse(values(reading)).success).toBe(true);
  });

  it.each(['-1', 'invalid', '10.1234'])('rejects current reading %j', (reading) => {
    expect(reportDetailFormSchema.safeParse(values(reading)).success).toBe(false);
  });

  it('requires a valid nonnegative calibration', () => {
    expect(reportDetailFormSchema.safeParse(values('10', '0.125')).success).toBe(true);
    expect(reportDetailFormSchema.safeParse(values('10', '')).success).toBe(false);
    expect(reportDetailFormSchema.safeParse(values('10', '-1')).success).toBe(false);
  });
});

describe('report income entries', () => {
  const entry = {
    id: 'income-1',
    description: 'PayMaya',
    notes: '',
  };

  it('accepts zero for configured recurring income', () => {
    const result = reportDetailFormSchema.safeParse({
      ...values('10'),
      incomeEntries: [{ ...entry, recurringIncomeFieldId: 'field-1', amount: '0.00' }],
    });
    expect(result.success).toBe(true);
    expect(reportDetailFormSchema.safeParse({
      ...values('10'),
      incomeEntries: [{ ...entry, recurringIncomeFieldId: 'field-1', amount: '' }],
    }).success).toBe(true);
  });

  it('rejects zero for custom income and expenses', () => {
    const custom = { ...entry, recurringIncomeFieldId: null, amount: '0' };
    expect(reportDetailFormSchema.safeParse({ ...values('10'), incomeEntries: [custom] }).success).toBe(false);
    expect(reportDetailFormSchema.safeParse({ ...values('10'), expenseEntries: [custom] }).success).toBe(false);
  });
});
