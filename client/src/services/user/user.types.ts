import type { ValueOf } from '~/utils/valueOf';

import type { Tenant } from '../tenant/tenant.types';

export const UserRoleEnum = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type UserRole = ValueOf<typeof UserRoleEnum>;

export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;

  hasTenant: boolean;
  tenants: Tenant[];

  birthday?: Date;
  contact?: string;
  address?: string;
  sss?: string;
  tin?: string;
  philhealth?: string;
  pagibig?: string;
};
