import { X, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '~/utils/cn'
import { Button } from './button'
import { Spinner } from './spinner'

type ConfirmationDialogProps = {
  open: boolean
  title: string
  description?: ReactNode
  children?: ReactNode
  icon?: LucideIcon
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
  icon: Icon,
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
        <header className="flex items-start gap-3 p-4">
          {Icon && (
            <span
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-md text-primary-foreground',
                variant === 'danger' ? 'bg-destructive' : 'bg-primary',
              )}
            >
              <Icon aria-hidden="true" className="size-5" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-lg font-semibold text-text-heading">
              {title}
            </h2>
            {description && (
              <div id={descriptionId} className="mt-1 text-sm text-text-secondary">
                {description}
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close"
            className="-mr-2 -mt-1 text-text-secondary"
            disabled={loading}
            onClick={close}
          >
            <X aria-hidden="true" />
          </Button>
        </header>

        {children && <div className="min-h-0 overflow-y-auto px-4 pb-4">{children}</div>}

        <footer className="flex items-center justify-end gap-3 border-t border-border p-4">
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
