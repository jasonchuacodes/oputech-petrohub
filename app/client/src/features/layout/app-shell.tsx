import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Spinner } from '~/components/ui/spinner'
import { cn } from '~/utils/cn'
import { setActiveTenant, useActiveTenantId } from '../tenants/active-tenant'
import { useTenantsQuery } from '../tenants/tenants.queries'
import { navigation, type NavigationItem } from './navigation'

function NavigationLink({ item, compact = false }: { item: NavigationItem; compact?: boolean }) {
  const Icon = item.icon
  const { pathname } = useLocation()
  const relatedActive = item.activePaths?.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
  return (
    <NavLink
      to={item.href}
      aria-current={relatedActive ? 'page' : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30',
          compact
            ? 'min-h-16 flex-col justify-center gap-1 px-1 py-2 text-xs'
            : 'min-h-11 gap-3 rounded-sm px-3 text-sm',
          isActive || relatedActive
            ? compact
              ? 'text-primary'
              : 'bg-primary/10 text-primary'
            : compact
              ? 'text-text-tertiary hover:text-text-secondary'
              : 'text-text-secondary hover:bg-surface-hover',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            aria-hidden="true"
            strokeWidth={compact ? (isActive || relatedActive ? 2 : 1.75) : 2}
            className={compact ? 'size-6' : 'size-5 shrink-0'}
          />
          <span className={cn(!compact && 'md:sr-only wide:not-sr-only')}>{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

export function AppShell() {
  const tenants = useTenantsQuery()
  const activeTenantId = useActiveTenantId()

  useEffect(() => {
    if (!tenants.data?.length) return
    if (!tenants.data.some(({ tenant }) => tenant.id === activeTenantId)) {
      setActiveTenant(tenants.data[0].tenant.id)
    }
  }, [activeTenantId, tenants.data])

  if (tenants.isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (tenants.isError || !tenants.data?.length) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-5 text-center">
        <div className="flex max-w-sm flex-col gap-2">
          <h1 className="text-page-title font-semibold">No station access</h1>
          <p className="text-sm text-text-secondary">
            Your account is not assigned to an active station. Contact an administrator.
          </p>
        </div>
      </main>
    )
  }

  const selected =
    tenants.data.find(({ tenant }) => tenant.id === activeTenantId) ?? tenants.data[0]
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <aside className="hidden w-20 shrink-0 flex-col border-r border-border/70 bg-card px-2 py-4 md:flex wide:w-64">
        <div className="flex h-14 items-center justify-center px-2 wide:justify-start">
          <span className="text-lg font-semibold text-primary md:hidden wide:inline">Petromate</span>
          <span className="text-lg font-semibold text-primary wide:hidden" aria-label="Petromate">
            P
          </span>
        </div>

        <label className="mb-4 hidden flex-col gap-1 px-2 wide:flex">
          <span className="text-xs font-medium text-text-tertiary">Station</span>
          <select
            value={selected.tenant.id}
            onChange={(event) => setActiveTenant(event.target.value)}
            className="h-10 rounded-sm border border-input bg-card px-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/20"
          >
            {tenants.data.map(({ tenant }) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>
        </label>

        <nav aria-label="Primary navigation" className="flex flex-1 flex-col gap-1">
          {navigation.map((item) => (
            <NavigationLink key={item.href} item={item} />
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet context={{ tenant: selected, tenants: tenants.data }} />
        </main>

        <nav
          aria-label="Primary navigation"
          className="z-30 shrink-0 bg-card pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] shadow-[0_-2px_8px_rgba(16,16,16,0.05)] md:hidden"
        >
          <div className="mx-auto flex w-full max-w-lg px-1">
            {navigation.map((item) => (
              <div key={item.href} className="min-w-0 flex-1">
                <NavigationLink item={item} compact />
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
