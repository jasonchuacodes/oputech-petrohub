'use client'

import { History, Plus, UsersRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { PageHeader } from '~/components/ui/page-header'
import { Spinner } from '~/components/ui/spinner'
import type { TenantUserAvailability, UserRole } from '~/generated/graphql'
import { useDisclosure } from '~/hooks/useDisclosure'
import { useSessionQuery } from '../../auth/auth.queries'
import { useAppShellContext } from '../../layout/use-active-tenant'
import { useUsersQuery, type UserSummary } from '../users.queries'
import { AddUserSheet } from './add-user-sheet'
import { UserActions } from './user-actions'
import { ViewUserSheet } from './view-user-sheet'

const pageSize = 20

export function UsersPage() {
  const session = useSessionQuery()
  const { tenant: selected } = useAppShellContext()
  const router = useRouter()
  const user = session.data?.user
  const role = user?.role
  const isAdmin = role === 'superadmin' || role === 'admin'

  useEffect(() => {
    if (role && !isAdmin) router.replace('/me')
  }, [isAdmin, role, router])

  if (!user || !role || !isAdmin) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <TenantUsersPage
      key={selected.tenant.id}
      tenantId={selected.tenant.id}
      timezone={selected.tenant.timezone}
      actorId={user.id}
      actorRole={role}
    />
  )
}

function TenantUsersPage({
  tenantId,
  timezone,
  actorId,
  actorRole,
}: {
  tenantId: string
  timezone: string
  actorId: string
  actorRole: UserRole
}) {
  const creating = useDisclosure()
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null)
  const [availability, setAvailability] = useState<TenantUserAvailability>('active')
  const [offset, setOffset] = useState(0)
  const users = useUsersQuery(tenantId, availability, offset, pageSize)

  const totalCount = users.data?.totalCount ?? 0
  const pageStart = totalCount === 0 ? 0 : offset + 1
  const pageEnd = Math.min(offset + pageSize, totalCount)
  const nextTransitionAt = users.data?.nextTransitionAt
  const refetchUsers = users.refetch

  useEffect(() => {
    if (!users.isSuccess || offset === 0 || offset < totalCount) return
    const timeout = window.setTimeout(
      () => setOffset(Math.max(0, Math.floor((totalCount - 1) / pageSize) * pageSize)),
      0,
    )
    return () => window.clearTimeout(timeout)
  }, [offset, totalCount, users.isSuccess])

  useEffect(() => {
    if (!nextTransitionAt) return
    const delay = new Date(nextTransitionAt).getTime() - Date.now() + 500
    if (delay <= 0) {
      void refetchUsers()
      return
    }
    const timeout = window.setTimeout(() => void refetchUsers(), Math.min(delay, 2_147_483_647))
    return () => window.clearTimeout(timeout)
  }, [nextTransitionAt, refetchUsers])

  return (
    <div className="mx-auto flex w-full flex-col gap-5 px-5 py-5 md:max-w-4xl md:p-6 wide:max-w-7xl">
      <PageHeader
        title="Users"
        description="Manage users and their access to this tenant."
        backHref="/me"
        backLabel="Back to Me"
        backVisibility="mobile"
        action={
          users.isSuccess && availability === 'active' ? (
            <Button type="button" size="sm" className="hidden md:inline-flex" onClick={creating.onOpen}>
              <Plus aria-hidden="true" />
              Add user
            </Button>
          ) : undefined
        }
      />

      <AddUserSheet
        open={creating.open}
        tenantId={tenantId}
        actorRole={actorRole}
        onClose={creating.onClose}
      />

      {selectedUser && (
        <ViewUserSheet
          tenantId={tenantId}
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      <div
        role="group"
        aria-label="User availability"
        className="w-full rounded-md bg-muted p-1 wide:rounded-none wide:border-b wide:border-border wide:bg-transparent wide:p-0"
      >
        <div className="flex w-full wide:max-w-md">
          {(['active', 'inactive'] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={availability === value}
              className={`flex min-h-11 flex-1 items-center justify-center rounded-sm px-3 text-sm font-medium outline-none transition-colors focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/30 wide:-mb-px wide:min-h-10 wide:flex-none wide:justify-start wide:rounded-none wide:border-b-2 wide:px-4 wide:text-left wide:text-control ${
                availability === value
                  ? 'bg-primary text-primary-foreground shadow-sm wide:border-primary wide:bg-transparent wide:text-primary wide:shadow-none'
                  : 'text-text-secondary hover:bg-surface-hover wide:border-transparent wide:hover:bg-transparent wide:hover:text-text-heading'
              }`}
              onClick={() => {
                setAvailability(value)
                setOffset(0)
              }}
            >
              {value === 'active' ? 'Active' : 'Inactive'}
            </button>
          ))}
        </div>
      </div>

      {users.isPending ? (
        <div className="flex min-h-48 items-center justify-center rounded-md bg-card shadow-card">
          <Spinner className="size-6" />
        </div>
      ) : users.isError ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
          <p className="text-sm text-text-secondary">Unable to load users.</p>
          <Button type="button" variant="outline" onClick={() => void users.refetch()}>
            Try again
          </Button>
        </div>
      ) : users.data.items.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UsersRound aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="font-medium text-text-heading">
              {availability === 'active' ? 'No active users' : 'No inactive users'}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {availability === 'active'
                ? 'Add the first user for this tenant.'
                : 'Deactivated users will appear here.'}
            </p>
          </div>
        </div>
      ) : (
        <section aria-labelledby="users-list-heading" className="flex flex-col gap-3">
          <h2 id="users-list-heading" className="sr-only">
            Tenant users
          </h2>
          <ul className="overflow-hidden rounded-md bg-card shadow-card">
            {users.data.items.map((listedUser) => (
              <li
                key={listedUser.id}
                className="flex min-h-20 items-center gap-3 border-b border-border/60 px-4 py-3 last:border-b-0"
              >
                <span className="min-w-0 flex-1">
                  <button
                    type="button"
                    className="block max-w-full cursor-pointer truncate rounded-sm text-left font-medium text-text-heading underline-offset-4 outline-none hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/30"
                    onClick={() => setSelectedUser(listedUser)}
                  >
                    {listedUser.fullName}
                  </button>
                  <span className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-text-tertiary">
                    <span className="truncate">{listedUser.username}</span>
                    <span aria-hidden="true">•</span>
                    <span className="shrink-0">{getRoleLabel(listedUser.role)}</span>
                  </span>
                  {listedUser.tenantMembership?.deactivation && (
                    <span className="mt-1 block text-xs text-text-secondary">
                      {listedUser.tenantMembership.availability === 'active'
                        ? `Scheduled for ${formatDate(listedUser.tenantMembership.deactivation.effectiveDate)}`
                        : `${getReasonLabel(listedUser.tenantMembership.deactivation.reason)} · effective ${formatDate(listedUser.tenantMembership.deactivation.effectiveDate)}`}
                    </span>
                  )}
                </span>
                {availability === 'inactive' && listedUser.role === 'member' && (
                  <Button asChild type="button" variant="outline" size="icon">
                    <Link
                      href={`/timesheet/${listedUser.id}`}
                      aria-label={`View ${listedUser.fullName}'s attendance history`}
                      title="View attendance history"
                    >
                      <History aria-hidden="true" />
                    </Link>
                  </Button>
                )}
                <UserActions
                  tenantId={tenantId}
                  timezone={timezone}
                  user={listedUser}
                  actorId={actorId}
                  actorRole={actorRole}
                />
              </li>
            ))}
          </ul>

          {totalCount > pageSize && (
            <nav aria-label="Users pagination" className="flex items-center justify-between gap-3">
              <p className="text-sm text-text-tertiary">
                {pageStart}–{pageEnd} of {totalCount}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={offset === 0 || users.isFetching}
                  onClick={() => setOffset(Math.max(0, offset - pageSize))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={offset + pageSize >= totalCount || users.isFetching}
                  onClick={() => setOffset(offset + pageSize)}
                >
                  Next
                </Button>
              </div>
            </nav>
          )}
        </section>
      )}

      {users.isSuccess && availability === 'active' && (
        <Button type="button" variant="outline" className="w-full md:hidden" onClick={creating.onOpen}>
          <Plus aria-hidden="true" />
          Add user
        </Button>
      )}
    </div>
  )
}

function getReasonLabel(reason: 'resign' | 'terminated' | 'other'): string {
  if (reason === 'resign') return 'Resigned'
  if (reason === 'terminated') return 'Terminated'
  return 'Other'
}

function formatDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
    new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1)),
  )
}

function getRoleLabel(role: UserRole): string {
  if (role === 'admin') return 'Administrator'
  if (role === 'superadmin') return 'Super administrator'
  return 'Member'
}
