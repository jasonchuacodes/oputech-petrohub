import { type ReactNode } from 'react'

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-0.5">
        <h1 className="text-page-title font-semibold">{title}</h1>
        {description && <p className="text-sm text-text-secondary">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
