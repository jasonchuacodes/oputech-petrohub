'use client'

import { useAppShellContext } from '../layout/use-active-tenant'
import { UserRole } from '../users/user-role'
import { AdminHomePage } from './admin-home'
import { MemberHomePage } from './member-home'

export function DashboardPage() {
  const { tenant: selected } = useAppShellContext()

  if (selected.role === UserRole.Member) return <MemberHomePage />

  return <AdminHomePage key={selected.tenant.id} access={selected} />
}
