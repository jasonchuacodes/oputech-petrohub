import type { ReactNode } from 'react'

export function PageIntro({ children }: { children: ReactNode }) {
  return (
    <section aria-label="Page overview">
      <p className="text-sm text-text-secondary">{children}</p>
    </section>
  )
}
