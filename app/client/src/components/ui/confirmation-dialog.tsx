import type { LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './button'
import { DialogHeader } from './dialog-header'
import { Spinner } from './spinner'

type ConfirmationDialogProps = {
  open: boolean
  title: string
  description?: ReactNode
  children?: ReactNode
  icon: LucideIcon
  variant?: 'default' | 'danger'
  confirmText?: string
  cancelText?: string
  disabled?: boolean
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmationDialog({
  open,
  title,
  description,
  children,
  icon,
  variant = 'default',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  disabled,
  loading,
  onClose,
  onConfirm,
}: ConfirmationDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const close = useCallback(() => {
    if (!loading) onClose()
  }, [loading, onClose])

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
  }, [close, open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close confirmation"
        tabIndex={-1}
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        disabled={loading}
        onClick={close}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="relative z-10 flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-card shadow-lg"
      >
        <DialogHeader
          title={title}
          titleId={titleId}
          description={description}
          descriptionId={descriptionId}
          icon={icon}
          variant={variant}
          closeDisabled={loading}
          onClose={close}
        />

        {children && <div className="min-h-0 overflow-y-auto px-5 pb-5">{children}</div>}

        <footer className="flex items-center justify-end gap-3 border-t border-border p-5">
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none"
            disabled={loading}
            onClick={close}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === 'danger' ? 'destructive' : 'default'}
            className="flex-1 sm:flex-none"
            disabled={disabled || loading}
            onClick={onConfirm}
          >
            {loading && <Spinner className="size-4" />}
            {confirmText}
          </Button>
        </footer>
      </section>
    </div>,
    document.body,
  )
}
