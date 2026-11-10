import { useOutletContext } from 'react-router-dom'
import type { TenantAccess } from '../tenants/tenants.queries'

type AppShellContext = {
  tenant: TenantAccess
  tenants: TenantAccess[]
}

export function useAppShellContext() {
  return useOutletContext<AppShellContext>()
}

export function useActiveTenant() {
  return useAppShellContext().tenant
}
