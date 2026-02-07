export enum PayrollPeriodType {
  WEEKLY = 'WEEKLY',
}

export interface Payroll {
  id: string;
  tenantId: string;
  userId: string;
  periodType: PayrollPeriodType;
  periodStart: string;
  periodEnd: string;
  totalHours: number;
  totalCompensation: number;
  rateSnapshot: number;
  rateTypeSnapshot: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratePayrollInput {
  userId: string;
  tenantId: string;
  timesheetIds: string[];
  periodType: PayrollPeriodType;
  periodStart: string;
  periodEnd: string;
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

export interface GetPayrollRecordsParams {
  tenantId: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}
