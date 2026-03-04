import type { ValueOf } from '~/utils/valueOf';

export const RateType = {
  HOURLY: 'HOURLY',
  DAILY: 'DAILY',
} as const;

export type RateType = ValueOf<typeof RateType>;

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
