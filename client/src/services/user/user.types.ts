import type { ValueOf } from '~/utils/valueOf';

import type { Tenant } from '../tenant/tenant.types';
import type { SalaryRateType } from '../payroll/payroll.types';

export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type UserRole = ValueOf<typeof UserRole>;

export type SalaryRate = {
  id: string;
  rate: number;
  rateType: SalaryRateType;
  effectiveFrom: string;
  createdAt: string;
};

export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;

  shouldChangePassword: boolean;

  hasTenant: boolean;
  tenantId?: string;
  tenants: Tenant[];

  birthday?: Date;
  contact?: string;
  address?: string;
  position?: string;
  sss?: string;
  tin?: string;
  philhealth?: string;
  pagibig?: string;

  salaryRates?: SalaryRate[];

  shiftSchedule?: {
    shiftId: string;
    shiftName: string;
    shiftStart: Date;
    shiftEnd: Date;
    color: string;
  } | null;
};
