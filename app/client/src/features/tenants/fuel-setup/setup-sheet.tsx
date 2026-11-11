import { X } from 'lucide-react'
import { useCallback, useEffect, useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '~/components/ui/button'

type SetupSheetProps = {
  open: boolean
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
  layer?: 'default' | 'nested'
  escapeDisabled?: boolean
}

export function SetupSheet({ open, title, description, children, onClose, layer = 'default', escapeDisabled = false }: SetupSheetProps) {
  const titleId = useId()
  const descriptionId = useId()
  const close = useCallback(() => onClose(), [onClose])

  useEffect(() => {
    if (!open) return
    const originalOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !escapeDisabled) close()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [close, escapeDisabled, open])

  if (!open) return null

  return createPortal(
    <div className={`fixed inset-0 ${layer === 'nested' ? 'z-[60]' : 'z-50'} flex items-end justify-center wide:items-center wide:p-6`}>
      <button type="button" aria-label="Close sheet" tabIndex={-1} className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={close} />
      <section role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} className="relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-sheet bg-card shadow-2xl wide:max-w-xl wide:rounded-lg">
        <div aria-hidden="true" className="mx-auto mt-3 h-1.5 w-14 shrink-0 rounded-full bg-foreground/35 wide:hidden" />
        <header className="flex shrink-0 items-start gap-3 p-5 pb-4">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-lg font-semibold text-text-heading">{title}</h2>
            {description && <p id={descriptionId} className="mt-0.5 text-sm text-text-secondary">{description}</p>}
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="Close" className="-mr-2 -mt-1 text-text-secondary" onClick={close}><X aria-hidden="true" /></Button>
        </header>
        {children}
      </section>
    </div>,
    document.body,
  )
}
