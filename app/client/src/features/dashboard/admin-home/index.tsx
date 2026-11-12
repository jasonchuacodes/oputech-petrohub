'use client'

import type { TenantAccess } from '../../tenants/tenants.queries'
import { HomeGreeting } from '../home-greeting'
import { FuelProducts } from './fuel-products'
import { YesterdayReportSummary } from './yesterday-report-summary'

export function AdminHomePage({ access }: { access: TenantAccess }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col gap-5 px-5 py-5 md:p-6">
      <HomeGreeting />
      <FuelProducts tenantId={access.tenant.id} timezone={access.tenant.timezone} />
      <YesterdayReportSummary tenantId={access.tenant.id} timezone={access.tenant.timezone} />
    </div>
  )
}
