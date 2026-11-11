'use client'

import { X } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { Button } from './button'

const focusableSelector =
  'button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[href],[tabindex]:not([tabindex="-1"])'

export type SheetProps = {
  open: boolean
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
  layer?: 'default' | 'nested'
  escapeDisabled?: boolean
  manageFocus?: boolean
  initialFocusRef?: RefObject<HTMLElement | null>
  returnFocusRef?: RefObject<HTMLElement | null>
  showCloseButton?: boolean
}

export function Sheet({
  open,
  title,
  description,
  children,
  onClose,
  layer = 'default',
  escapeDisabled = false,
  manageFocus = false,
  initialFocusRef,
  returnFocusRef,
  showCloseButton = true,
}: SheetProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => onClose(), [onClose])

  useEffect(() => {
    if (!open) return
    const originalOverflow = document.body.style.overflow
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && !escapeDisabled) close()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [close, escapeDisabled, open])

  useEffect(() => {
    if (!open || !manageFocus) return
    const returnTarget = returnFocusRef?.current ??
      (document.activeElement instanceof HTMLElement ? document.activeElement : null)
    const focusTarget = initialFocusRef?.current ?? closeButtonRef.current
    focusTarget?.focus()
    return () => {
      if (returnTarget?.isConnected) returnTarget.focus()
    }
  }, [initialFocusRef, manageFocus, open, returnFocusRef])

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!manageFocus || event.key !== 'Tab') return
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    )
    if (!focusable.length) return
    if (event.shiftKey && document.activeElement === focusable[0]) {
      event.preventDefault()
      focusable.at(-1)?.focus()
    } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
      event.preventDefault()
      focusable[0]?.focus()
    }
  }

  if (!open) return null

  return createPortal(
    <div
      className={`fixed inset-0 ${layer === 'nested' ? 'z-[60]' : 'z-50'} flex items-end justify-center wide:items-center wide:p-6`}
    >
      <button
        type="button"
        aria-label="Close sheet"
        tabIndex={-1}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={close}
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-sheet bg-card shadow-2xl wide:max-w-xl wide:rounded-lg"
        onKeyDown={handleKeyDown}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-3 h-1.5 w-14 shrink-0 rounded-full bg-foreground/35 wide:hidden"
        />
        <header className="flex shrink-0 items-start gap-3 p-5 pb-4">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-xl font-semibold text-text-heading">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-0.5 text-sm text-text-secondary">
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <Button
              ref={closeButtonRef}
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close"
              className="-mr-2 -mt-1 text-text-secondary"
              onClick={close}
            >
              <X aria-hidden="true" />
            </Button>
          )}
        </header>
        {children}
      </section>
    </div>,
    document.body,
  )
}
