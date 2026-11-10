import type { Metadata } from 'next'
import { ShiftManagementPage } from '~/features/tenants/shift-management'

export const metadata: Metadata = { title: 'Shift management' }

export default function ShiftsRoute() {
  return <ShiftManagementPage />
}
