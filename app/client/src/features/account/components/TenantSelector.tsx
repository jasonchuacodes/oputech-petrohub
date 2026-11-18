'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useAppShellContext } from '../../layout/use-active-tenant';

export const TenantSelector = () => {
  const { tenant } = useAppShellContext();
  const content = (
    <>
      <span className="min-w-0 flex-1">
        <span className="text-text-heading block truncate font-medium">
          {tenant.tenant?.name ?? 'No tenant'}
        </span>
        <span className="text-text-tertiary block text-sm">View and switch tenants</span>
      </span>
      <ChevronRight className="text-text-tertiary size-5" aria-hidden="true" />
    </>
  );

  return (
    <Link
      href="/tenants"
      className="overflow-hidden rounded-md bg-card  hover:bg-surface-hover focus-visible:ring-ring/30 shadow-card flex min-h-16 items-center gap-3 p-3 text-left outline-none focus-visible:ring-3"
    >
      {content}
    </Link>
  );
};
