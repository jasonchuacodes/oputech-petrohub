import { useOutletContext } from 'react-router-dom'
import type { ViewerTenant } from '../tenants/tenants.queries'

export function useActiveTenant() {
  return useOutletContext<{ tenant: ViewerTenant }>().tenant
}
