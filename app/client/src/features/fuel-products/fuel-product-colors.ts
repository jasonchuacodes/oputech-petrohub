import type { FuelProductColor } from '~/generated/graphql'

export const fuelProductColors = ['gray', 'orange', 'green', 'red', 'yellow'] as const satisfies readonly FuelProductColor[]
export const defaultFuelProductColor: FuelProductColor = 'gray'

export const fuelProductColorOptions: ReadonlyArray<{ value: FuelProductColor; label: string }> = [
  { value: 'gray', label: 'Grey' },
  { value: 'orange', label: 'Orange' },
  { value: 'green', label: 'Green' },
  { value: 'red', label: 'Red' },
  { value: 'yellow', label: 'Yellow' },
]

export const fuelProductColorClasses: Record<FuelProductColor, { foreground: string; surface: string }> = {
  gray: { foreground: 'text-fuel-gray', surface: 'bg-fuel-gray/10' },
  orange: { foreground: 'text-fuel-orange', surface: 'bg-fuel-orange/10' },
  green: { foreground: 'text-fuel-green', surface: 'bg-fuel-green/10' },
  red: { foreground: 'text-fuel-red', surface: 'bg-fuel-red/10' },
  yellow: { foreground: 'text-fuel-yellow', surface: 'bg-fuel-yellow/10' },
}
