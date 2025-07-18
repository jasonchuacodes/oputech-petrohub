import type { ValueOf } from '~/utils/valueOf';

export const UserRoleEnum = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type UserRole = ValueOf<typeof UserRoleEnum>;

export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;

  hasTenant: boolean;
};
