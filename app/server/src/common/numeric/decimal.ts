import Decimal from 'decimal.js'
import { Types } from 'mongoose'

Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP })

export function decimal(value: string | Types.Decimal128): Decimal {
  return new Decimal(typeof value === 'string' ? value : value.toString())
}

export function decimal128(value: Decimal.Value): Types.Decimal128 {
  return Types.Decimal128.fromString(new Decimal(value).toFixed())
}

export function money(value: Decimal.Value): Decimal {
  return new Decimal(value).toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
}

export function decimalString(value?: Types.Decimal128 | null): string | undefined {
  return value?.toString()
}

export function sum(values: Decimal.Value[]): Decimal {
  return values.reduce<Decimal>((total, value) => total.plus(value), new Decimal(0))
}
