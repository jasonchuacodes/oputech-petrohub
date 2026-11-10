import { createContext, use } from 'react'
import type { TenantAccess } from '../tenants/tenants.queries'

export type AppShellContextValue = {
  tenant: TenantAccess
  tenants: TenantAccess[]
}

export const AppShellContext = createContext<AppShellContextValue | null>(null)

export function useAppShellContext() {
  const context = use(AppShellContext)
  if (!context) throw new Error('useAppShellContext must be used within AppShell')
  return context
}

export function useActiveTenant() {
  return useAppShellContext().tenant
}
