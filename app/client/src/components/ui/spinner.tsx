import { LoaderCircle } from 'lucide-react'
import { cn } from '~/utils/cn'

export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle aria-label="Loading" className={cn('size-5 animate-spin', className)} />
}
