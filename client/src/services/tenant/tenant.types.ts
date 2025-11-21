import type { ValueOf } from '~/utils/valueOf';

import type { User } from '../user/user.types';

export type Tenant = {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  description: string;

  sss?: string;
  tin?: string;
  philhealth?: string;
  pagibig?: string;

  logoUrl?: string;
};

export const UserStatusEnum = {
  IN: 'IN',
  OUT: 'OUT',
} as const;

export type UserStatus = ValueOf<typeof UserStatusEnum>;

export type TenantUser = User & {
  status: UserStatus;
};
