import { ArrowLeftRight, Check, Plus } from 'lucide-react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '~/components/ui/button'
import { PageHeader } from '~/components/ui/page-header'
import { useAuth } from '../auth/auth-context'
import { useSessionQuery } from '../auth/auth.queries'
import { useAppShellContext } from '../layout/use-active-tenant'
import { AddTenantSheet } from './add-tenant-sheet'
import { setActiveTenant } from './active-tenant'
import { TenantActions } from './tenant-actions'
import type { TenantSummary } from './tenants.queries'

export function TenantsPage() {
  const auth = useAuth()
  const session = useSessionQuery()
  const { tenant: selected, tenants } = useAppShellContext()
  const [creating, setCreating] = useState(false)
  const role = session.data?.user.role
  const isAdmin = role === 'superadmin' || role === 'admin'
  const canCreate = role === 'superadmin'

  if (!isAdmin) return <Navigate to="/me" replace />

  const selectTenant = (tenantId: string) => {
    if (tenantId === selected.tenant.id) return
    setActiveTenant(tenantId)
    auth.activateTenant(tenantId)
  }

  const activateCreatedTenant = (tenant: TenantSummary) => {
    setActiveTenant(tenant.id)
    auth.activateTenant(tenant.id)
  }

  const handleDeleted = (tenantId: string) => {
    if (tenantId !== selected.tenant.id) return
    const nextTenant = tenants.find(({ tenant }) => tenant.id !== tenantId)
    if (!nextTenant) return
    setActiveTenant(nextTenant.tenant.id)
    auth.activateTenant(nextTenant.tenant.id)
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader
        title="Tenants"
        description="Manage workspaces and choose where reports are recorded."
        action={
          canCreate ? (
            <Button type="button" className="gap-2" onClick={() => setCreating(true)}>
              <Plus aria-hidden="true" />
              Add tenant
            </Button>
          ) : undefined
        }
      />

      <AddTenantSheet
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={activateCreatedTenant}
      />

      <ul className="overflow-hidden rounded-md bg-card shadow-card">
        {tenants.map(({ tenant }) => {
          const active = tenant.id === selected.tenant.id

          return (
            <li
              key={tenant.id}
              className="flex min-h-24 items-center gap-3 border-b border-border/60 px-3 py-3 last:border-b-0"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`size-12 rounded-full ${
                  active
                    ? 'bg-muted text-text-tertiary'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
                disabled={active}
                aria-label={active ? `${tenant.name} is active` : `Switch to ${tenant.name}`}
                onClick={() => selectTenant(tenant.id)}
              >
                <ArrowLeftRight aria-hidden="true" className="size-5" />
              </Button>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-card-title font-medium text-text-heading">
                  {tenant.name}
                </span>
                <span className="mt-1 flex items-center gap-1 text-sm text-text-tertiary">
                  {active ? (
                    <>
                      <Check aria-hidden="true" className="size-4" />
                      Active tenant
                    </>
                  ) : (
                    'Available workspace'
                  )}
                </span>
              </span>
              <TenantActions
                tenantId={tenant.id}
                tenantName={tenant.name}
                canDelete={role === 'superadmin'}
                deleteDisabled={tenants.length <= 1}
                onDeleted={handleDeleted}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
