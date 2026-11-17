import { Building2 } from 'lucide-react'
import { useCallback, useEffect, useId, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '~/components/ui/button'
import { DialogHeader } from '~/components/ui/dialog-header'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import { useCreateTenantMutation, type TenantSummary } from './tenants.queries'

type AddTenantSheetProps = {
  open: boolean
  onClose: () => void
  onCreated: (tenant: TenantSummary) => void
}

export function AddTenantSheet({ open, onClose, onCreated }: AddTenantSheetProps) {
  const createTenant = useCreateTenantMutation()
  const [name, setName] = useState('')
  const [error, setError] = useState<string>()
  const titleId = useId()
  const descriptionId = useId()

  const close = useCallback(() => {
    if (createTenant.isPending) return
    setName('')
    setError(undefined)
    onClose()
  }, [createTenant.isPending, onClose])

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

  if (!open) return null

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = name.trim()
    if (!value || createTenant.isPending) return

    setError(undefined)
    try {
      const tenant = await createTenant.mutateAsync(value)
      setName('')
      onCreated(tenant)
      onClose()
    } catch {
      setError('Unable to create the tenant. Please try again.')
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center wide:items-center wide:p-6">
      <button
        type="button"
        aria-label="Close Add Tenant sheet"
        tabIndex={-1}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        disabled={createTenant.isPending}
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

        <DialogHeader
          title="Add Tenant"
          titleId={titleId}
          description="Create a workspace for a new station."
          descriptionId={descriptionId}
          icon={Building2}
          closeLabel="Close Add Tenant"
          closeDisabled={createTenant.isPending}
          onClose={close}
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-tenant-name" className="text-sm font-medium">
              Tenant name *
            </label>
            <Input
              id="new-tenant-name"
              autoFocus
              required
              maxLength={80}
              value={name}
              placeholder="e.g. Main Station"
              disabled={createTenant.isPending}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'new-tenant-error' : undefined}
              onChange={(event) => setName(event.target.value)}
            />
            {error && (
              <p id="new-tenant-error" role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
        </div>

        <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={createTenant.isPending}
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!name.trim() || createTenant.isPending}
          >
            {createTenant.isPending && <Spinner className="size-4" />}
            {createTenant.isPending ? 'Creating…' : 'Create Tenant'}
          </Button>
        </footer>
      </form>
    </div>,
    document.body,
  )
}
