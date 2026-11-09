import { type ComponentProps } from 'react'
import { cn } from '~/utils/cn'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-11 w-full min-w-0 rounded-sm border border-input bg-card px-3 text-base outline-none transition-colors placeholder:text-text-tertiary focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/10 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 wide:h-10 wide:text-sm',
        className,
      )}
      {...props}
    />
  )
}
