import { describe, expect, it } from 'vitest'
import { pumpMeterFormSchema } from './fuel-setup.schema'

describe('pump meter form', () => {
  const values = {
    label: 'ADO 1',
    productId: 'product-1',
    initialReading: '100.000',
    currentReading: '125.125',
  }

  it('accepts a non-negative current reading with up to three decimal places', () => {
    expect(pumpMeterFormSchema.safeParse(values).success).toBe(true)
    expect(pumpMeterFormSchema.safeParse({ ...values, currentReading: '0' }).success).toBe(true)
  })

  it('rejects negative or overly precise current readings', () => {
    expect(pumpMeterFormSchema.safeParse({ ...values, currentReading: '-1' }).success).toBe(false)
    expect(pumpMeterFormSchema.safeParse({ ...values, currentReading: '125.1234' }).success).toBe(false)
  })
})
