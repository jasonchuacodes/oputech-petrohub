import { type ReactNode } from 'react'
import { PageBackButton } from './page-back-button'

export function PageHeader({
  title,
  description,
  action,
  backHref,
  backLabel = 'Back',
  backVisibility = 'always',
}: {
  title: string
  description: ReactNode
  action?: ReactNode
  backHref?: string
  backLabel?: string
  backVisibility?: 'always' | 'mobile'
}) {
  return (
    <header className="flex min-h-11 items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        {backHref && (
          <PageBackButton
            href={backHref}
            label={backLabel}
            className={backVisibility === 'mobile' ? 'md:hidden' : undefined}
          />
        )}
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="text-page-title font-semibold">{title}</h1>
          {description && <p className="text-sm text-text-secondary">{description}</p>}
        </div>
      </div>
      {action && <div className="flex shrink-0 items-center">{action}</div>}
    </header>
  )
}
