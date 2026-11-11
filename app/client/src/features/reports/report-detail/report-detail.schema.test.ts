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
