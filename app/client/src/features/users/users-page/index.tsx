'use client'

import { Plus, UsersRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { PageHeader } from '~/components/ui/page-header'
import { PageIntro } from '~/components/ui/page-intro'
import { Spinner } from '~/components/ui/spinner'
import type { UserRole } from '~/generated/graphql'
import { useDisclosure } from '~/hooks/useDisclosure'
import { useSessionQuery } from '../../auth/auth.queries'
import { useAppShellContext } from '../../layout/use-active-tenant'
import { useUsersQuery } from '../users.queries'
import { AddUserSheet } from './add-user-sheet'
import { UserActions } from './user-actions'

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
      actorId={user.id}
      actorRole={role}
    />
  )
}

function TenantUsersPage({
  tenantId,
  actorId,
  actorRole,
}: {
  tenantId: string
  actorId: string
  actorRole: UserRole
}) {
  const creating = useDisclosure()
  const [offset, setOffset] = useState(0)
  const users = useUsersQuery(tenantId, offset, pageSize)

  const totalCount = users.data?.totalCount ?? 0
  const pageStart = totalCount === 0 ? 0 : offset + 1
  const pageEnd = Math.min(offset + pageSize, totalCount)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader
        title="Users"
        backHref="/me"
        backLabel="Back to Me"
      />

      <PageIntro>Manage users and their access to this tenant.</PageIntro>

      <AddUserSheet
        open={creating.open}
        tenantId={tenantId}
        actorRole={actorRole}
        onClose={creating.onClose}
      />

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
            <p className="font-medium text-text-heading">No users yet</p>
            <p className="mt-1 text-sm text-text-secondary">
              Add the first user for this tenant.
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
                  <span className="block truncate font-medium text-text-heading">
                    {listedUser.fullName}
                  </span>
                  <span className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-text-tertiary">
                    <span className="truncate">{listedUser.username}</span>
                    <span aria-hidden="true">•</span>
                    <span className="shrink-0">{getRoleLabel(listedUser.role)}</span>
                  </span>
                </span>
                <UserActions
                  tenantId={tenantId}
                  user={listedUser}
                  actorId={actorId}
                  actorRole={actorRole}
                  onDeleted={() => {
                    if (users.data.items.length === 1 && offset > 0) {
                      setOffset(Math.max(0, offset - pageSize))
                    }
                  }}
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

      {users.isSuccess && (
        <Button type="button" variant="outline" className="w-full" onClick={creating.onOpen}>
          <Plus aria-hidden="true" />
          Add user
        </Button>
      )}
    </div>
  )
}

function getRoleLabel(role: UserRole): string {
  if (role === 'admin') return 'Administrator'
  if (role === 'superadmin') return 'Super administrator'
  return 'Member'
}
