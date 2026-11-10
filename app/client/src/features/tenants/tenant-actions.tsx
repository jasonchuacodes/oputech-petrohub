import { ChevronRight, Pencil, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useId, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '~/components/ui/button'
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import { useDeleteTenantMutation, useUpdateTenantMutation } from './tenants.queries'

type TenantActionsProps = {
  tenantId: string
  tenantName: string
  canDelete: boolean
  deleteDisabled: boolean
  onDeleted: (tenantId: string) => void
}

export function TenantActions({
  tenantId,
  tenantName,
  canDelete,
  deleteDisabled,
  onDeleted,
}: TenantActionsProps) {
  const updateTenant = useUpdateTenantMutation()
  const deleteTenant = useDeleteTenantMutation()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'actions' | 'edit'>('actions')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [name, setName] = useState(tenantName)
  const [error, setError] = useState<string>()
  const titleId = useId()
  const descriptionId = useId()

  const resetAndClose = useCallback(() => {
    setOpen(false)
    setView('actions')
    setName(tenantName)
    setError(undefined)
  }, [tenantName])

  const close = useCallback(() => {
    if (!updateTenant.isPending) resetAndClose()
  }, [resetAndClose, updateTenant.isPending])

  useEffect(() => {
    if (!open) return

    const originalOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, close])

  const openActions = () => {
    setView('actions')
    setName(tenantName)
    setError(undefined)
    setOpen(true)
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = name.trim()
    if (!value || value === tenantName || updateTenant.isPending) return

    setError(undefined)
    try {
      await updateTenant.mutateAsync({ tenantId, name: value })
      resetAndClose()
    } catch {
      setError('Unable to update the tenant. Please try again.')
    }
  }

  const remove = async () => {
    if (deleteDisabled || deleteTenant.isPending) return

    setError(undefined)
    try {
      await deleteTenant.mutateAsync(tenantId)
      setDeleteOpen(false)
      onDeleted(tenantId)
    } catch {
      setError('Unable to delete the tenant. Please try again.')
    }
  }

  const editing = view === 'edit'

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Actions for ${tenantName}`}
        title="Tenant actions"
        onClick={openActions}
      >
        <ChevronRight aria-hidden="true" className="size-5" />
      </Button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end justify-center wide:items-center wide:p-6">
            <button
              type="button"
              aria-label={editing ? 'Close Edit tenant sheet' : 'Close tenant actions'}
              tabIndex={-1}
              className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
              disabled={updateTenant.isPending}
              onClick={close}
            />
            <form
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              className="relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-sheet bg-card shadow-2xl wide:max-w-xl wide:rounded-lg"
              noValidate
              onSubmit={submit}
            >
              <div
                aria-hidden="true"
                className="mx-auto mt-3 h-1.5 w-14 shrink-0 rounded-full bg-foreground/35 wide:hidden"
              />

              <header className="relative flex shrink-0 flex-col gap-1 p-5 pr-16">
                <h2 id={titleId} className="text-lg font-semibold text-text-heading">
                  {editing ? 'Edit tenant' : 'Tenant actions'}
                </h2>
                <p id={descriptionId} className="text-sm text-text-secondary">
                  {editing ? 'Update the tenant name shown across the workspace.' : tenantName}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={editing ? 'Close Edit tenant' : 'Close tenant actions'}
                  className="absolute right-3 top-4 text-text-secondary"
                  disabled={updateTenant.isPending}
                  onClick={close}
                >
                  <X aria-hidden="true" />
                </Button>
              </header>

              {editing ? (
                <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`edit-tenant-name-${tenantId}`} className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id={`edit-tenant-name-${tenantId}`}
                      autoFocus
                      required
                      maxLength={80}
                      value={name}
                      disabled={updateTenant.isPending}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? `edit-tenant-error-${tenantId}` : undefined}
                      onChange={(event) => setName(event.target.value)}
                    />
                    {error && (
                      <p
                        id={`edit-tenant-error-${tenantId}`}
                        role="alert"
                        className="text-sm text-destructive"
                      >
                        {error}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-0 flex-col gap-2 overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setView('edit')}
                  >
                    <Pencil aria-hidden="true" />
                    Edit name
                  </Button>
                  {canDelete && (
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full"
                      disabled={deleteDisabled}
                      title={
                        deleteDisabled ? 'You must keep at least one tenant' : `Delete ${tenantName}`
                      }
                      onClick={() => {
                        resetAndClose()
                        setDeleteOpen(true)
                      }}
                    >
                      <Trash2 aria-hidden="true" />
                      Delete
                    </Button>
                  )}
                </div>
              )}

              {editing && (
                <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    disabled={updateTenant.isPending}
                    onClick={close}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={!name.trim() || name.trim() === tenantName || updateTenant.isPending}
                  >
                    {updateTenant.isPending && <Spinner className="size-4" />}
                    {updateTenant.isPending ? 'Saving…' : 'Save'}
                  </Button>
                </footer>
              )}
            </form>
          </div>,
          document.body,
        )}

      <ConfirmationDialog
        open={deleteOpen}
        title="Delete tenant?"
        description="This action cannot be undone."
        icon={Trash2}
        variant="danger"
        confirmText="Delete tenant"
        loading={deleteTenant.isPending}
        onClose={() => {
          if (!deleteTenant.isPending) {
            setDeleteOpen(false)
            setError(undefined)
          }
        }}
        onConfirm={() => void remove()}
      >
        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm text-text-secondary">
            <strong className="font-medium text-text-heading">{tenantName}</strong> and its users,
            reports, and activity will be permanently deleted.
          </p>
        </div>
        {error && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        )}
      </ConfirmationDialog>
    </>
  )
}
