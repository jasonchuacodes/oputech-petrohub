import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '~/utils/cn'
import { Button } from './button'

type PageBackButtonProps = {
  href: string
  label?: string
  className?: string
}

export function PageBackButton({ href, label = 'Back', className }: PageBackButtonProps) {
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className={cn('-ml-2 shrink-0 [&_svg]:size-6', className)}
    >
      <Link href={href} aria-label={label}>
        <ChevronLeft aria-hidden="true" />
      </Link>
    </Button>
  )
}
