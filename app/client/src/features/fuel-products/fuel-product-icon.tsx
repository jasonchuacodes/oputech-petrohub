import { Fuel } from 'lucide-react'
import type { FuelProductColor } from '~/generated/graphql'
import { cn } from '~/utils/cn'
import { defaultFuelProductColor, fuelProductColorClasses } from './fuel-product-colors'

export function FuelProductIcon({
  color = defaultFuelProductColor,
  className,
  containerClassName,
  tile = false,
}: {
  color?: FuelProductColor
  className?: string
  containerClassName?: string
  tile?: boolean
}) {
  const classes = fuelProductColorClasses[color]
  const icon = <Fuel aria-hidden="true" className={cn('shrink-0', classes.foreground, className)} />

  if (!tile) return icon

  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-md', classes.surface, containerClassName)}>
      {icon}
    </span>
  )
}
