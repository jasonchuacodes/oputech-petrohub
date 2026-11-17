'use client'

import { useRef, type KeyboardEvent } from 'react'
import { cn } from '~/utils/cn'

type SectionTabOption<Value extends string> = {
  value: Value
  label: string
  id: string
  panelId: string
}

type SectionTabsProps<Value extends string> = {
  ariaLabel: string
  tabs: readonly SectionTabOption<Value>[]
  value: Value
  onValueChange: (value: Value) => void
  touchSize?: 'default' | 'large'
  className?: string
}

function SectionTabs<Value extends string>({
  ariaLabel,
  tabs,
  value,
  onValueChange,
  touchSize = 'default',
  className,
}: SectionTabsProps<Value>) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined

    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabs.length - 1
    if (nextIndex === undefined) return

    event.preventDefault()
    const nextTab = tabs[nextIndex]
    tabRefs.current[nextIndex]?.focus()
    onValueChange(nextTab.value)
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      className={cn(
        'w-full rounded-md bg-muted p-1 wide:rounded-none wide:border-b wide:border-border wide:bg-transparent wide:p-0',
        className,
      )}
    >
      <div className="flex w-full wide:max-w-md">
        {tabs.map((tab, index) => {
          const selected = tab.value === value

          return (
            <button
              key={tab.value}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              id={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={tab.panelId}
              tabIndex={selected ? 0 : -1}
              className={cn(
                'flex flex-1 items-center justify-center rounded-sm px-3 font-medium outline-none transition-colors focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/40 wide:-mb-px wide:min-h-10 wide:flex-none wide:justify-start wide:rounded-none wide:border-b-2 wide:px-4 wide:text-left wide:text-control',
                touchSize === 'large' ? 'min-h-12 text-base' : 'min-h-11 text-sm',
                selected
                  ? 'bg-primary text-primary-foreground shadow-sm wide:border-primary wide:bg-transparent wide:text-primary wide:shadow-none'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-heading wide:border-transparent wide:hover:bg-transparent',
              )}
              onClick={() => onValueChange(tab.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { SectionTabs, type SectionTabOption }
