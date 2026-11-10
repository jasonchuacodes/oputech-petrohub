import type { Metadata } from 'next'
import { DashboardPage } from '~/features/dashboard/dashboard-page'

export const metadata: Metadata = { title: 'Home' }

export default function HomeRoute() {
  return <DashboardPage />
}
