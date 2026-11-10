import { useOutletContext } from 'react-router-dom'
import type { TenantAccess } from '../tenants/tenants.queries'

export function useActiveTenant() {
  return useOutletContext<{ tenant: TenantAccess }>().tenant
}
