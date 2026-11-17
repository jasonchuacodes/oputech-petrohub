import { useId, type ReactNode } from 'react'
import { cn } from '~/utils/cn'

type ContentSectionProps = {
  label: string
  rightContent?: ReactNode
  children: ReactNode
  className?: string
  headingClassName?: string
}

export function ContentSection({
  label,
  rightContent,
  children,
  className,
  headingClassName,
}: ContentSectionProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className={cn('flex flex-col gap-0', className)}>
      <div className="flex min-h-10 items-center justify-between gap-3">
        <h2
          id={headingId}
          className={cn(
            'font-sans text-sm font-semibold uppercase tracking-[0.14em] text-text-heading',
            headingClassName,
          )}
        >
          {label}
        </h2>
        {rightContent}
      </div>
      {children}
    </section>
  )
}
