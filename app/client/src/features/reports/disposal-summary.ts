import Decimal from 'decimal.js'
import type { FuelProductColor } from '~/generated/graphql'

export type DisposalSummaryInput = {
  productId: string
  productName: string
  productColor: FuelProductColor
  netVolume?: string | null
}

export type DisposalSummaryItem = {
  productId: string
  productName: string
  productColor: FuelProductColor
  netVolume?: string
}

type PendingSummary = {
  productId: string
  productName: string
  productColor: FuelProductColor
  total: Decimal
  complete: boolean
}

export function summarizeDisposalsByProduct(
  readings: readonly DisposalSummaryInput[],
): DisposalSummaryItem[] {
  const summaries = new Map<string, PendingSummary>()

  for (const reading of readings) {
    const current = summaries.get(reading.productId) ?? {
      productId: reading.productId,
      productName: reading.productName,
      productColor: reading.productColor,
      total: new Decimal(0),
      complete: true,
    }
    const netVolume = parseNetVolume(reading.netVolume)
    if (!netVolume) current.complete = false
    else current.total = current.total.plus(netVolume)
    summaries.set(reading.productId, current)
  }

  return Array.from(summaries.values(), ({ productId, productName, productColor, total, complete }) => ({
    productId,
    productName,
    productColor,
    netVolume: complete ? total.toFixed(3) : undefined,
  }))
}

function parseNetVolume(value?: string | null) {
  if (value === undefined || value === null || value === '') return undefined
  try {
    const amount = new Decimal(value)
    return amount.isFinite() && !amount.isNegative() ? amount : undefined
  } catch {
    return undefined
  }
}
