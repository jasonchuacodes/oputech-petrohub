'use client';

import type { TenantAccess } from '../../tenants/tenants.queries';
import { Suspense } from 'react';
import { CurrentTankReadings } from './current-tank-readings';
import { FinancialSummary, FinancialSummarySkeleton } from './financial-summary';
import { FuelProducts } from './fuel-products';
import { SubmittedReports } from './submitted-reports';
import { Button } from '../../../components/ui/button';
import { Bell } from 'lucide-react';
import { BrandLogo } from '../../../components/BrandLogo';

export function AdminHomePage({ access }: { access: TenantAccess }) {
  return (
    <div className="flex min-h-full w-full flex-col">
      <header className="border-border/60 bg-white/95 sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b px-5 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <BrandLogo className="w-9 shrink-0" />
          <h1 className="max-w-[13rem] truncate text-base font-medium">
            {access.tenant.name ?? 'Oputech Petrohub'}
          </h1>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled
          aria-label="Notifications coming soon"
          title="Notifications coming soon"
        >
          <Bell className="size-5" aria-hidden="true" />
        </Button>
      </header>

      <main className="mx-auto flex w-full flex-1 flex-col gap-5 px-5 py-5 md:max-w-4xl md:p-6 wide:max-w-7xl">
        <Suspense fallback={<FinancialSummarySkeleton />}>
          <FinancialSummary tenantId={access.tenant.id} timezone={access.tenant.timezone} />
        </Suspense>

        <FuelProducts tenantId={access.tenant.id} timezone={access.tenant.timezone} />

        <CurrentTankReadings tenantId={access.tenant.id} />

        <SubmittedReports tenantId={access.tenant.id} timezone={access.tenant.timezone} />
      </main>
    </div>
  );
}
