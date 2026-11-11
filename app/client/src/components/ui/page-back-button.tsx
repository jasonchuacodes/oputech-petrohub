import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from './button'

type PageBackButtonProps = {
  href: string
  label?: string
}

export function PageBackButton({ href, label = 'Back' }: PageBackButtonProps) {
  return (
    <Button asChild variant="ghost" size="icon" className="-ml-2 shrink-0 [&_svg]:size-6">
      <Link href={href} aria-label={label}>
        <ChevronLeft aria-hidden="true" />
      </Link>
    </Button>
  )
}
