import { ChevronRight, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '~/components/ui/button'
import type { AuthUser, UserRole } from '../auth/auth.types'
import { useLogoutMutation, useSessionQuery } from '../auth/auth.queries'
import { clearActiveTenant } from '../tenants/active-tenant'

const actions = [
  {
    title: 'Account settings',
    description: 'Manage your personal account and security',
  },
  {
    title: 'User management',
    description: 'Manage users, roles, and station access',
    adminOnly: true,
  },
  {
    title: 'Tenant management',
    description: 'Manage workspaces and choose the active station',
    adminOnly: true,
    href: '/tenants',
  },
  {
    title: 'Reports',
    description: 'Generate and review shift reports',
    href: '/report',
  },
] as const

export function MePage() {
  const session = useSessionQuery()
  const logout = useLogoutMutation()
  const user = session.data?.user
  const isAdmin = user?.role === 'superadmin' || user?.role === 'admin'
  const visibleActions = actions.filter((action) => !('adminOnly' in action) || isAdmin)

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-5 px-5 py-5 md:p-6">
      <h1 className="sr-only">Me</h1>

      <section className="flex items-center gap-4 rounded-md bg-card p-4 shadow-card">
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground sm:size-16 sm:text-xl"
        >
          {getInitials(user)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-card-title font-medium text-text-heading">
            {user?.username ?? 'Account'}
          </p>
          <p className="text-sm text-text-tertiary">{getRoleLabel(user?.role)}</p>
        </div>
      </section>

      <section aria-labelledby="manage-heading" className="flex flex-col gap-0">
        <div className="flex min-h-10 items-center">
          <h2 id="manage-heading" className="text-card-title font-medium text-text-heading">
            Manage
          </h2>
        </div>
        <ul className="overflow-hidden rounded-md bg-card shadow-card">
          {visibleActions.map((action) => (
            <li key={action.title} className="border-b border-border/60 last:border-b-0">
              {'href' in action ? (
                <Link
                  to={action.href}
                  className="flex min-h-18 items-center gap-3 px-4 py-3 outline-none transition-colors hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30"
                >
                  <ActionContent title={action.title} description={action.description} />
                </Link>
              ) : (
                <div className="flex min-h-18 items-center gap-3 px-4 py-3">
                  <ActionContent title={action.title} description={action.description} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Session">
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          disabled={logout.isPending}
          onClick={() => {
            clearActiveTenant()
            logout.mutate()
          }}
        >
          <LogOut aria-hidden="true" />
          {logout.isPending ? 'Signing out…' : 'Sign out'}
        </Button>
      </section>
    </div>
  )
}

function ActionContent({ title, description }: { title: string; description: string }) {
  return (
    <>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-text-heading">{title}</span>
        <span className="block text-sm text-text-tertiary">{description}</span>
      </span>
      <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-text-tertiary" />
    </>
  )
}

function getInitials(user?: AuthUser): string {
  const name = user?.displayFullName?.trim() || [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  const parts = name.split(/\s+/).filter(Boolean)

  if (parts.length > 1) return `${parts[0][0]}${parts.at(-1)?.[0] ?? ''}`.toUpperCase()

  const source = parts[0] || user?.username || 'A'
  return source.slice(0, 2).toUpperCase()
}

function getRoleLabel(role?: UserRole): string {
  if (role === 'superadmin') return 'Super administrator'
  if (role === 'admin') return 'Administrator'
  if (role === 'member') return 'Member'
  return 'Account'
}
