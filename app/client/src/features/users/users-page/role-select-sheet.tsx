import { Check, ShieldCheck } from 'lucide-react'
import { useCallback, useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { DialogHeader } from '~/components/ui/dialog-header'
import type { UserRole } from '~/generated/graphql'

export type ManageableUserRole = Extract<UserRole, 'admin' | 'member'>

type RoleSelectSheetProps = {
  open: boolean
  value: ManageableUserRole
  roles: readonly ManageableUserRole[]
  onSelect: (role: ManageableUserRole) => void
  onClose: () => void
}

export function RoleSelectSheet({
  open,
  value,
  roles,
  onSelect,
  onClose,
}: RoleSelectSheetProps) {
  const titleId = useId()
  const descriptionId = useId()
  const close = useCallback(() => onClose(), [onClose])

  useEffect(() => {
    if (!open) return
    const originalOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopImmediatePropagation()
        close()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [close, open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center wide:items-center wide:p-6">
      <button
        type="button"
        aria-label="Close role selection"
        tabIndex={-1}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={close}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-sheet bg-card shadow-2xl wide:max-w-xl wide:rounded-lg"
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-3 h-1.5 w-14 shrink-0 rounded-full bg-foreground/35 wide:hidden"
        />
        <DialogHeader
          title="Select Role"
          titleId={titleId}
          description="Choose the user's access level."
          descriptionId={descriptionId}
          icon={ShieldCheck}
          closeLabel="Close role selection"
          onClose={close}
        />

        <div
          role="radiogroup"
          aria-label="User role"
          className="min-h-0 overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
        >
          <div className="overflow-hidden rounded-md border border-border">
            {roles.map((role) => {
              const selected = role === value
              return (
                <button
                  key={role}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  autoFocus={selected}
                  className="flex min-h-14 w-full items-center gap-3 border-b border-border/60 px-4 py-3 text-left outline-none transition-colors last:border-b-0 hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30"
                  onClick={() => {
                    onSelect(role)
                    close()
                  }}
                >
                  <span className="min-w-0 flex-1 font-medium text-text-heading">
                    {getRoleLabel(role)}
                  </span>
                  {selected && <Check aria-hidden="true" className="size-5 text-primary" />}
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </div>,
    document.body,
  )
}

export function getRoleLabel(role: ManageableUserRole): string {
  return role === 'admin' ? 'Administrator' : 'Member'
}
