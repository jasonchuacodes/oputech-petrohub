'use client'

import { Clock3, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { PageHeader } from '~/components/ui/page-header'
import { Spinner } from '~/components/ui/spinner'
import { formatShiftTime } from '~/utils/time'
import { useSessionQuery } from '../../auth/auth.queries'
import { useActiveTenant } from '../../layout/use-active-tenant'
import { type ShiftRecord, useDeleteShiftMutation, useShiftsQuery } from '../tenants.queries'
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
  const [editor, setEditor] = useState<{
    shift?: ShiftRecord
    initialView?: 'actions' | 'edit'
  } | null>(null)
  const [deleting, setDeleting] = useState<ShiftRecord | null>(null)
  const [deleteError, setDeleteError] = useState<string>()
  const shifts = useShiftsQuery(tenantId)
  const deleteShift = useDeleteShiftMutation(tenantId)

  const removeShift = async () => {
    if (!deleting) return
    setDeleteError(undefined)
    try {
      await deleteShift.mutateAsync(deleting.id)
      setDeleting(null)
      toast.success('Shift deleted successfully')
    } catch {
      setDeleteError('Unable to delete the shift. Please try again.')
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-5 px-5 py-5 md:max-w-4xl md:p-6 wide:max-w-7xl">
      <PageHeader
        title="Shift management"
        description="Configure the daily shift schedule for this tenant."
        backHref="/me"
        backLabel="Back to Me"
        backVisibility="mobile"
        action={
          shifts.isSuccess ? (
            <Button type="button" size="sm" className="hidden md:inline-flex" onClick={() => setEditor({})}>
              <Plus aria-hidden="true" />
              Add shift
            </Button>
          ) : undefined
        }
      />

      {editor && (
        <ShiftSheet
          key={editor.shift?.id ?? 'new'}
          open
          tenantId={tenantId}
          tenantName={tenantName}
          shift={editor.shift}
          initialView={editor.initialView}
          onClose={() => setEditor(null)}
        />
      )}

      <ConfirmationDialog
        open={Boolean(deleting)}
        title="Delete shift?"
        description={deleting ? `${deleting.name} · ${formatShiftTime(deleting)} will be removed from the tenant schedule.` : undefined}
        icon={Trash2}
        variant="danger"
        confirmText="Delete shift"
        loading={deleteShift.isPending}
        onClose={() => {
          if (!deleteShift.isPending) {
            setDeleting(null)
            setDeleteError(undefined)
          }
        }}
        onConfirm={() => void removeShift()}
      >
        <p className="text-sm text-text-secondary">
          Existing reports keep their saved shift interval.
        </p>
        {deleteError && <p role="alert" className="mt-3 text-sm text-destructive">{deleteError}</p>}
      </ConfirmationDialog>

      <div className="flex w-full flex-col gap-5 wide:max-w-2xl wide:self-start">
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
                <li key={shift.id} className="relative flex min-h-18 items-center gap-3 border-b border-border/60 px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-hover">
                  <button
                    type="button"
                    className="absolute inset-0 rounded-sm text-left outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30 wide:hidden"
                    aria-label={`Edit ${shift.name} shift, ${formatShiftTime(shift)}`}
                    onClick={() => setEditor({ shift })}
                  />
                  <span className="pointer-events-none relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock3 aria-hidden="true" className="size-5" />
                  </span>
                  <span className="pointer-events-none relative z-10 min-w-0 flex-1">
                    <span className="block font-medium text-text-heading">
                      {shift.name}
                    </span>
                    <span className="block text-sm text-text-tertiary">
                      {formatShiftTime(shift)} · {shift.startTime > shift.endTime ? 'Overnight shift' : 'Daily shift'}
                    </span>
                  </span>
                  <MoreVertical aria-hidden="true" className="pointer-events-none relative z-10 size-5 shrink-0 text-text-tertiary wide:hidden" />
                  <div className="relative z-10 hidden wide:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label={`Actions for ${shift.name}`}
                          title="Shift actions"
                        >
                          <MoreVertical aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setEditor({ shift, initialView: 'edit' })}>
                          <Pencil aria-hidden="true" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => {
                            setDeleteError(undefined)
                            setDeleting(shift)
                          }}
                        >
                          <Trash2 aria-hidden="true" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {shifts.isSuccess && (
          <Button type="button" variant="outline" className="w-full md:hidden" onClick={() => setEditor({})}>
            <Plus aria-hidden="true" />
            Add shift
          </Button>
        )}
      </div>
    </div>
  )
}
