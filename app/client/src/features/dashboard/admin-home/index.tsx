'use client'

import type { TenantAccess } from '../../tenants/tenants.queries'
import { Suspense } from 'react'
import { HomeGreeting } from '../home-greeting'
import { FinancialSummary, FinancialSummarySkeleton } from './financial-summary'
import { FuelProducts } from './fuel-products'
import { SubmittedReports } from './submitted-reports'

export function AdminHomePage({ access }: { access: TenantAccess }) {
  return (
    <div className="mx-auto flex min-h-full w-full flex-col gap-5 px-5 py-5 md:max-w-4xl md:p-6 wide:max-w-7xl">
      <HomeGreeting />
      <Suspense fallback={<FinancialSummarySkeleton />}>
        <FinancialSummary tenantId={access.tenant.id} timezone={access.tenant.timezone} />
      </Suspense>
      <FuelProducts tenantId={access.tenant.id} timezone={access.tenant.timezone} />
      <SubmittedReports tenantId={access.tenant.id} timezone={access.tenant.timezone} />
    </div>
  )
}
