import { type ReactNode } from 'react'
import { PageBackButton } from './page-back-button'

export function PageHeader({
  title,
  description,
  action,
  backHref,
  backLabel = 'Back',
}: {
  title: string
  description?: string
  action?: ReactNode
  backHref?: string
  backLabel?: string
}) {
  return (
    <header className="flex min-h-11 items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        {backHref && <PageBackButton href={backHref} label={backLabel} />}
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="text-page-title font-semibold">{title}</h1>
          {description && <p className="text-sm text-text-secondary">{description}</p>}
        </div>
      </div>
      {action && <div className="flex shrink-0 items-center">{action}</div>}
    </header>
  )
}
