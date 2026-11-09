import { useOutletContext } from 'react-router-dom'
import type { ViewerTenant } from '../tenants/tenant.queries'

export function useActiveTenant() {
  return useOutletContext<{ tenant: ViewerTenant }>().tenant
}
