export enum RateType {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
}

export interface SalaryRate {
  id: string;
  userId: string;
  tenantId: string;
  rate: number;
  rateType: RateType;
  effectiveFrom: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalaryRateInput {
  userId: string;
  tenantId: string;
  rate: number;
  rateType: RateType;
  effectiveFrom?: string;
}
