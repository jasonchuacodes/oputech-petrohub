import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentProps } from 'react'
import { cn } from '~/utils/cn'

const buttonVariants = cva(
  'text-control inline-flex shrink-0 items-center justify-center rounded-sm border border-transparent font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-brand text-white hover:bg-brand-hover',
        outline: 'border-border bg-card text-foreground hover:bg-surface-hover',
        ghost: 'hover:bg-surface-hover',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
      },
      size: {
        default: 'h-11 gap-2 px-3.5 wide:h-10',
        sm: 'h-10 gap-1.5 px-3',
        lg: 'h-12 gap-2 px-4 wide:h-11',
        icon: 'size-11 wide:size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button'
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { Button }
