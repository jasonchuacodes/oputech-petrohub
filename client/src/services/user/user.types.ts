import type { ValueOf } from '~/utils/valueOf';

import type { Tenant } from '../tenant/tenant.types';
import type { SalaryRateType } from '../payroll/payroll.types';

export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type UserRole = ValueOf<typeof UserRole>;

export const EmploymentStatus = {
  REGULAR: 'REGULAR',
  PROBATIONARY: 'PROBATIONARY',
  TERMINATED: 'TERMINATED',
  RESIGNED: 'RESIGNED',
} as const;

export type EmploymentStatus = ValueOf<typeof EmploymentStatus>;

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
  lastTenantId?: string | null;

  birthday?: Date;
  contact?: string;
  address?: string;

  employeeId?: number;
  position?: string;
  hireDate?: Date;
  status?: EmploymentStatus;
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
