'use client'

import { Clock3, MoreVertical, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { PageHeader } from '~/components/ui/page-header'
import { PageIntro } from '~/components/ui/page-intro'
import { Spinner } from '~/components/ui/spinner'
import { useSessionQuery } from '../../auth/auth.queries'
import { useActiveTenant } from '../../layout/use-active-tenant'
import { type ShiftRecord, useShiftsQuery } from '../tenants.queries'
import { ShiftSheet } from './shift-sheet'

export function ShiftManagementPage() {
  const session = useSessionQuery()
  const selected = useActiveTenant()
  const router = useRouter()
  const role = session.data?.user.role
  const canManage = role === 'superadmin' || role === 'admin'

  useEffect(() => {
    if (role && !canManage) router.replace('/me')
  }, [canManage, role, router])

  if (!role || !canManage) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <TenantShiftManagementPage
      key={selected.tenant.id}
      tenantId={selected.tenant.id}
      tenantName={selected.tenant.name}
    />
  )
}

function TenantShiftManagementPage({
  tenantId,
  tenantName,
}: {
  tenantId: string
  tenantName: string
}) {
  const [editor, setEditor] = useState<{ shift?: ShiftRecord } | null>(null)
  const shifts = useShiftsQuery(tenantId)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader title="Shift management" backHref="/me" backLabel="Back to Me" />

      <PageIntro>Configure the daily shift schedule for this tenant.</PageIntro>

      {editor && (
        <ShiftSheet
          key={editor.shift?.id ?? 'new'}
          open
          tenantId={tenantId}
          tenantName={tenantName}
          shift={editor.shift}
          onClose={() => setEditor(null)}
        />
      )}

      {shifts.isPending ? (
        <div className="flex min-h-48 items-center justify-center rounded-md bg-card shadow-card">
          <Spinner className="size-6" />
        </div>
      ) : shifts.isError ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
          <p className="text-sm text-text-secondary">Unable to load shifts.</p>
          <Button type="button" variant="outline" onClick={() => void shifts.refetch()}>
            Try again
          </Button>
        </div>
      ) : shifts.data.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock3 aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="font-medium text-text-heading">No shifts configured</p>
            <p className="mt-1 text-sm text-text-secondary">Add the first shift for this tenant.</p>
          </div>
        </div>
      ) : (
        <section aria-labelledby="shift-list-heading" className="flex flex-col gap-3">
          <h2 id="shift-list-heading" className="sr-only">
            Tenant shifts
          </h2>
          <ul className="overflow-hidden rounded-md bg-card shadow-card">
            {shifts.data.map((shift) => (
              <li
                key={shift.id}
                className="border-b border-border/60 last:border-b-0"
              >
                <button
                  type="button"
                  className="flex min-h-18 w-full items-center gap-3 px-4 py-3 text-left outline-none transition-colors hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30"
                  aria-label={`Edit shift ${shift.startTime} to ${shift.endTime}`}
                  onClick={() => setEditor({ shift })}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock3 aria-hidden="true" className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-text-heading">
                      {shift.startTime}–{shift.endTime}
                    </span>
                    <span className="block text-sm text-text-tertiary">
                      {shift.startTime > shift.endTime ? 'Overnight shift' : 'Daily shift'}
                    </span>
                  </span>
                  <MoreVertical aria-hidden="true" className="size-5 shrink-0 text-text-tertiary" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {shifts.isSuccess && (
        <Button type="button" variant="outline" className="w-full" onClick={() => setEditor({})}>
          <Plus aria-hidden="true" />
          Add shift
        </Button>
      )}
    </div>
  )
}
