import type { ValueOf } from '~/utils/valueOf';

export const PayrollPeriodType = {
  WEEKLY: 'WEEKLY',
} as const;

export type PayrollPeriodType = ValueOf<typeof PayrollPeriodType>;

export const PayrollRunStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
} as const;

export type PayrollRunStatus = ValueOf<typeof PayrollRunStatus>;

export const PaymentStatus = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  FAILED: 'FAILED',
} as const;

export type PaymentStatus = ValueOf<typeof PaymentStatus>;

export const SalaryRateType = {
  HOURLY: 'HOURLY',
  DAILY: 'DAILY',
  MONTHLY: 'MONTHLY',
} as const;

export type SalaryRateType = ValueOf<typeof SalaryRateType>;

export interface PayrollRun {
  id: string;
  tenantId: string;
  periodType: PayrollPeriodType;
  periodStart: string;
  periodEnd: string;
  status: PayrollRunStatus;
  createdBy: string;
  notes?: string | null;
  createdAt: string;
  payslips?: Array<{
    id: string;
    totalCompensation: string;
    paymentStatus: PaymentStatus;
  }>;
}

export interface Payslip {
  id: string;
  tenantId: string;
  userId: string;
  periodType: PayrollPeriodType;
  periodStart: string;
  periodEnd: string;
  totalHours: number;
  rateSnapshot: string;
  rateTypeSnapshot: SalaryRateType;
  totalCompensation: string;
  payrollRunId?: string | null; // Links to PayrollRun
  notes?: string | null; // Admin notes about adjustments
  paymentStatus: PaymentStatus; // UNPAID, PAID, or FAILED
  paidAt?: string | null; // When payment was made
  paymentMethod?: string | null; // "bank_transfer", "cash", etc.
  paymentNotes?: string | null; // Notes about payment
  createdBy: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    username: string;
  };
}

export interface GeneratePayslipInput {
  tenantId: string;
  userId: string;
  timesheetIds: string[];
  periodType: PayrollPeriodType;
  periodStart: string;
  periodEnd: string;
  totalHours: number;
  rateSnapshot: string;
  rateTypeSnapshot: SalaryRateType;
  totalCompensation: string;
  payrollRunId?: string;
  notes?: string;
}

export interface RunPayrollInput {
  tenantId: string;
  periodType: PayrollPeriodType;
  periodStart: string;
  periodEnd: string;
  payslips: Array<{
    userId: string;
    timesheetIds: string[];
    totalHours: number;
    rateSnapshot: string;
    rateTypeSnapshot: SalaryRateType;
    totalCompensation: string;
    notes?: string;
  }>;
  notes?: string;
}

export interface GetPayslipsParams {
  tenantId: string;
  userId?: string;
  periodStart?: string;
  periodEnd?: string;
}

export interface UnprocessedTimesheet {
  id: string;
  userId: string;
  tenantId: string;
  clockIn: string;
  clockOut: string | null;
  totalHours: number;
  date: string;
  processed: boolean;
}
