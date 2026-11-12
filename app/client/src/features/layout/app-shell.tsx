'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useSyncExternalStore, type ReactNode } from 'react'
import { OputechPetrohubLogo } from '~/components/brand/oputech-petrohub-logo'
import { Button } from '~/components/ui/button'
import { Spinner } from '~/components/ui/spinner'
import { cn } from '~/utils/cn'
import { getUserInitials, getUserRoleLabel } from '../account/account-display'
import { useSessionQuery } from '../auth/auth.queries'
import type { AuthUser } from '../auth/auth.types'
import { setActiveTenant, useActiveTenantId } from '../tenants/active-tenant'
import { useTenantsQuery } from '../tenants/tenants.queries'
import {
  desktopNavigation,
  managementNavigation,
  navigation,
  type NavigationItem,
} from './navigation'
import { SidebarTenantSwitcher } from './sidebar-tenant-switcher'
import { AppShellContext } from './use-active-tenant'

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'petromate:sidebar-collapsed'
let sidebarCollapsedFallback = false
const sidebarPreferenceListeners = new Set<() => void>()

function getSidebarCollapsedSnapshot() {
  try {
    const storedPreference = window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY)
    return storedPreference === null ? sidebarCollapsedFallback : storedPreference === 'true'
  } catch {
    return sidebarCollapsedFallback
  }
}

function getServerSidebarCollapsedSnapshot() {
  return false
}

function subscribeToSidebarPreference(onChange: () => void) {
  sidebarPreferenceListeners.add(onChange)

  const handleStorage = (event: StorageEvent) => {
    if (event.key === SIDEBAR_COLLAPSED_STORAGE_KEY) onChange()
  }

  window.addEventListener('storage', handleStorage)
  return () => {
    sidebarPreferenceListeners.delete(onChange)
    window.removeEventListener('storage', handleStorage)
  }
}

function setSidebarCollapsedPreference(collapsed: boolean) {
  sidebarCollapsedFallback = collapsed

  try {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(collapsed))
  } catch {
    // Keep the preference in memory when browser storage is unavailable.
  }

  sidebarPreferenceListeners.forEach((listener) => listener())
}

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavigationLink({
  item,
  compact = false,
  collapsed = false,
}: {
  item: NavigationItem
  compact?: boolean
  collapsed?: boolean
}) {
  const Icon = item.icon
  const pathname = usePathname()
  const relatedActive = item.activePaths?.some((path) => isRouteActive(pathname, path))
  const active = isRouteActive(pathname, item.href)
  return (
    <Link
      href={item.href}
      aria-current={active || relatedActive ? 'page' : undefined}
      title={collapsed && !compact ? item.label : undefined}
      className={cn(
        'flex items-center font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30',
        compact
          ? 'min-h-16 flex-col justify-center gap-1 px-1 py-2 text-xs'
          : 'min-h-10 gap-2 rounded-sm px-2.5 py-1 text-sm',
        collapsed && !compact && 'justify-center gap-0 px-0',
        active || relatedActive
          ? compact
            ? 'text-primary'
            : 'bg-primary/10 text-primary'
          : compact
            ? 'text-text-tertiary hover:text-text-secondary'
            : 'text-text-secondary hover:bg-surface-hover',
      )}
    >
      <span
        className={cn(
          'flex shrink-0 items-center justify-center',
          compact ? 'size-6' : 'size-8',
        )}
      >
        <Icon
          aria-hidden="true"
          strokeWidth={compact ? (active || relatedActive ? 2 : 1.75) : 2}
          className={compact ? 'size-6' : 'size-4'}
        />
      </span>
      <span className={cn(collapsed && !compact && 'sr-only')}>{item.label}</span>
    </Link>
  )
}

function AccountProfileLink({ user, collapsed }: { user: AuthUser; collapsed: boolean }) {
  const pathname = usePathname()
  const active = isRouteActive(pathname, '/me') || isRouteActive(pathname, '/account')

  return (
    <Link
      href="/me"
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed ? 'Me' : undefined}
      title={collapsed ? 'Me' : undefined}
      className={cn(
        'flex items-center rounded-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30',
        collapsed ? 'min-h-10 justify-center px-0 py-1' : 'min-h-12 gap-2 px-1.5 py-1',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-text-secondary hover:bg-surface-hover hover:text-foreground',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground',
          !active && 'bg-muted text-text-secondary',
        )}
      >
        {getUserInitials(user)}
      </span>
      <span className={cn('min-w-0 flex-1', collapsed && 'sr-only')}>
        <span className="block truncate text-sm font-medium">
          {user.fullName || user.username || 'Account'}
        </span>
        <span className="block truncate text-xs text-text-tertiary">
          {getUserRoleLabel(user.role)}
        </span>
      </span>
    </Link>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const tenants = useTenantsQuery()
  const session = useSessionQuery()
  const activeTenantId = useActiveTenantId()
  const pathname = usePathname()
  const isSidebarCollapsed = useSyncExternalStore(
    subscribeToSidebarPreference,
    getSidebarCollapsedSnapshot,
    getServerSidebarCollapsedSnapshot,
  )
  const user = session.data?.user
  const isAdmin = user?.role === 'superadmin' || user?.role === 'admin'
  const isReportDetail = pathname.split('/').filter(Boolean).length === 2 && pathname.startsWith('/report/')

  useEffect(() => {
    if (!tenants.data?.length) return
    if (!tenants.data.some(({ tenant }) => tenant.id === activeTenantId)) {
      setActiveTenant(tenants.data[0].tenant.id)
    }
  }, [activeTenantId, tenants.data])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsedPreference(!isSidebarCollapsed)
  }, [isSidebarCollapsed])

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
    <AppShellContext.Provider value={{ tenant: selected, tenants: tenants.data }}>
      <div className="flex h-dvh overflow-hidden bg-background">
        <aside
          className={cn(
            'hidden shrink-0 flex-col gap-4 border-r border-border/70 bg-card px-2 py-4 transition-[width,padding] duration-200 ease-out motion-reduce:transition-none md:flex',
            isSidebarCollapsed ? 'w-20' : 'w-64',
          )}
        >
          <div
            className={cn(
              'flex h-14 shrink-0 items-center',
              isSidebarCollapsed ? 'justify-center' : 'justify-between gap-2 px-2',
            )}
          >
            {!isSidebarCollapsed && (
              <Link
                href="/home"
                aria-label="Petromate home"
                className="shrink-0 rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                <OputechPetrohubLogo
                  aria-hidden="true"
                  aria-label={undefined}
                  className="w-36"
                />
              </Link>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-10"
              onClick={toggleSidebar}
              aria-controls="desktop-sidebar-navigation"
              aria-expanded={!isSidebarCollapsed}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="size-5" aria-hidden="true" />
              ) : (
                <ChevronLeft className="size-5" aria-hidden="true" />
              )}
            </Button>
          </div>

          <SidebarTenantSwitcher collapsed={isSidebarCollapsed} canSwitch={isAdmin} />

          <nav
            id="desktop-sidebar-navigation"
            aria-label="Primary navigation"
            className="flex min-h-0 flex-1 flex-col gap-4"
          >
            <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto">
              {desktopNavigation.map((item) => (
                <NavigationLink
                  key={item.href}
                  item={item}
                  collapsed={isSidebarCollapsed}
                />
              ))}

              {isAdmin &&
                managementNavigation.map((section) => (
                  <div
                    key={section.label}
                    className="mt-2 flex flex-col gap-0 border-t border-border/70 pt-2"
                  >
                    <p
                      className={cn(
                        'px-1.5 py-1 text-xs font-medium uppercase tracking-wide text-text-tertiary',
                        isSidebarCollapsed && 'sr-only',
                      )}
                    >
                      {section.label}
                    </p>
                    {section.items.map((item) => (
                      <NavigationLink
                        key={item.href}
                        item={item}
                        collapsed={isSidebarCollapsed}
                      />
                    ))}
                  </div>
                ))}
            </div>

            {user && <AccountProfileLink user={user} collapsed={isSidebarCollapsed} />}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>

          {!isReportDetail && (
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
          )}
        </div>
      </div>
    </AppShellContext.Provider>
  )
}
