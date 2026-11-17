import { X, type LucideIcon } from 'lucide-react'
import type { ReactNode, Ref } from 'react'
import { cn } from '~/utils/cn'
import { Button } from './button'

export type DialogHeaderProps = {
  title: string
  titleId: string
  description?: ReactNode
  descriptionId?: string
  icon: LucideIcon
  variant?: 'default' | 'danger'
  showCloseButton?: boolean
  closeLabel?: string
  closeDisabled?: boolean
  closeButtonRef?: Ref<HTMLButtonElement>
  onClose?: () => void
}

export function DialogHeader({
  title,
  titleId,
  description,
  descriptionId,
  icon: Icon,
  variant = 'default',
  showCloseButton = true,
  closeLabel = 'Close',
  closeDisabled,
  closeButtonRef,
  onClose,
}: DialogHeaderProps) {
  return (
    <header className="flex shrink-0 items-start gap-3 p-5 pb-4">
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-md text-primary-foreground',
          variant === 'danger' ? 'bg-destructive' : 'bg-primary',
        )}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 id={titleId} className="text-xl font-semibold text-text-heading">
          {title}
        </h2>
        {description && (
          <div id={descriptionId} className="mt-0.5 text-sm text-text-secondary">
            {description}
          </div>
        )}
      </div>
      {showCloseButton && onClose && (
        <Button
          ref={closeButtonRef}
          type="button"
          variant="ghost"
          size="icon"
          aria-label={closeLabel}
          className="-mr-2 -mt-1 text-text-secondary"
          disabled={closeDisabled}
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </Button>
      )}
    </header>
  )
}
