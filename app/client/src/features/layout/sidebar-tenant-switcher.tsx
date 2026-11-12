'use client'

import { Building2, ChevronsUpDown, Star } from 'lucide-react'
import Link from 'next/link'
import { cn } from '~/utils/cn'
import { useAppShellContext } from './use-active-tenant'

export function SidebarTenantSwitcher({
  collapsed,
  canSwitch,
}: {
  collapsed: boolean
  canSwitch: boolean
}) {
  const { tenant: selected } = useAppShellContext()
  const tenantName = selected.tenant.name

  if (!canSwitch) {
    return (
      <div
        aria-label="Active station"
        title={collapsed ? tenantName : undefined}
        className={cn(
          'flex min-h-14 w-full items-center gap-2 rounded-sm border border-border/60 bg-background px-2.5 py-2',
          collapsed && 'min-h-11 justify-center px-0 py-0',
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center text-text-secondary">
          <Star className="size-4" aria-hidden="true" />
        </span>
        <span className={cn('min-w-0 flex-1', collapsed && 'sr-only')}>
          <span className="block text-xs leading-4 text-text-tertiary">Current station</span>
          <span className="block truncate text-sm font-medium leading-5 text-text-heading">
            {tenantName}
          </span>
        </span>
      </div>
    )
  }

  return (
    <Link
      href="/tenants"
      aria-label={collapsed ? 'Manage tenants' : undefined}
      title={collapsed ? tenantName : undefined}
      className={cn(
        'flex min-h-14 w-full items-center gap-2 rounded-sm border border-border/60 bg-background px-2.5 py-2 text-left outline-none hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-ring/30',
        collapsed && 'min-h-11 justify-center px-0 py-0',
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center text-text-secondary">
        {collapsed ? (
          <ChevronsUpDown className="size-4" aria-hidden="true" />
        ) : (
          <Building2 className="size-4" aria-hidden="true" />
        )}
      </span>
      <span className={cn('min-w-0 flex-1', collapsed && 'sr-only')}>
        <span className="block text-xs leading-4 text-text-tertiary">Current station</span>
        <span className="block truncate text-sm font-medium leading-5 text-text-heading">
          {tenantName}
        </span>
      </span>
      <ChevronsUpDown
        aria-hidden="true"
        className={cn('size-4 shrink-0 text-text-secondary', collapsed && 'hidden')}
      />
    </Link>
  )
}
