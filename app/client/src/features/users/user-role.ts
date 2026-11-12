import type { UserRole as GraphqlUserRole } from '~/generated/graphql'

export const UserRole = {
  Admin: 'admin',
  Member: 'member',
  Superadmin: 'superadmin',
} as const satisfies Record<'Admin' | 'Member' | 'Superadmin', GraphqlUserRole>
