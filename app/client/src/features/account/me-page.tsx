'use client'

import { ChevronRight, LogOut } from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { ContentSection } from '~/components/ui/content-section'
import { PageHeader } from '~/components/ui/page-header'
import { useLogoutMutation, useSessionQuery } from '../auth/auth.queries'
import { managementNavigation } from '../layout/navigation'
import { clearActiveTenant } from '../tenants/active-tenant'
import { getUserInitials, getUserRoleLabel } from './account-display'

export function MePage() {
  const session = useSessionQuery()
  const logout = useLogoutMutation()
  const user = session.data?.user
  const isAdmin = user?.role === 'superadmin' || user?.role === 'admin'

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader title="Me" description="Manage your account and station settings." />

      <Link
        href="/account"
        aria-label="Open Account settings"
        className="flex items-center gap-4 rounded-md bg-card p-4 shadow-card outline-none transition-colors hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground sm:size-16 sm:text-xl"
        >
          {getUserInitials(user)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-card-title font-medium text-text-heading">
            {user?.fullName || user?.username || 'Account'}
          </p>
          <p className="text-sm text-text-tertiary">{getUserRoleLabel(user?.role)}</p>
        </div>
        <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-text-tertiary" />
      </Link>

      {isAdmin &&
        managementNavigation.map((section) => (
          <ContentSection key={section.label} label={section.label}>
            <ul className="overflow-hidden rounded-md bg-card shadow-card">
              {section.items.map((item) => (
                <li key={item.href} className="border-b border-border/60 last:border-b-0">
                  <Link
                    href={item.href}
                    className="flex min-h-18 items-center gap-3 px-4 py-3 outline-none transition-colors hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30"
                  >
                    <ActionContent title={item.label} description={item.description} />
                  </Link>
                </li>
              ))}
            </ul>
          </ContentSection>
        ))}

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
