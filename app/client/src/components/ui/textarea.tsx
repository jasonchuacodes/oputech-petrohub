import { type ComponentProps } from 'react'
import { cn } from '~/utils/cn'

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full min-w-0 resize-y rounded-sm border border-input bg-card px-3 py-2.5 text-base outline-none transition-colors placeholder:text-text-tertiary focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/10 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 wide:text-sm',
        className,
      )}
      {...props}
      autoComplete="off"
    />
  )
}
