import { describe, expect, it } from 'vitest'
import { summarizeDisposalsByProduct } from './disposal-summary'

describe('summarizeDisposalsByProduct', () => {
  it('collates decimal-safe net disposal totals by product', () => {
    expect(summarizeDisposalsByProduct([
      { productId: 'ado', productName: 'ADO', netVolume: '8.100' },
      { productId: 'xtr', productName: 'XTR', netVolume: '4.250' },
      { productId: 'ado', productName: 'ADO', netVolume: '21.900' },
    ])).toEqual([
      { productId: 'ado', productName: 'ADO', netVolume: '30.000' },
      { productId: 'xtr', productName: 'XTR', netVolume: '4.250' },
    ])
  })

  it('keeps product identities separate and preserves zero totals', () => {
    expect(summarizeDisposalsByProduct([
      { productId: 'ado-1', productName: 'ADO', netVolume: '0' },
      { productId: 'ado-2', productName: 'ADO', netVolume: '1.234' },
    ])).toEqual([
      { productId: 'ado-1', productName: 'ADO', netVolume: '0.000' },
      { productId: 'ado-2', productName: 'ADO', netVolume: '1.234' },
    ])
  })

  it.each([null, undefined, '', 'invalid', '-1', 'Infinity'])(
    'does not expose a partial product total when a reading is %s',
    (netVolume) => {
      expect(summarizeDisposalsByProduct([
        { productId: 'ado', productName: 'ADO', netVolume: '10' },
        { productId: 'ado', productName: 'ADO', netVolume },
        { productId: 'xtr', productName: 'XTR', netVolume: '2' },
      ])).toEqual([
        { productId: 'ado', productName: 'ADO', netVolume: undefined },
        { productId: 'xtr', productName: 'XTR', netVolume: '2.000' },
      ])
    },
  )
})
