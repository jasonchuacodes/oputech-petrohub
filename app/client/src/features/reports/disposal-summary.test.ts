import { describe, expect, it } from 'vitest'
import { summarizeDisposalsByProduct } from './disposal-summary'

describe('summarizeDisposalsByProduct', () => {
  it('collates decimal-safe net disposal totals by product', () => {
    expect(summarizeDisposalsByProduct([
      { productId: 'ado', productName: 'ADO', productColor: 'green', netVolume: '8.100' },
      { productId: 'xtr', productName: 'XTR', productColor: 'orange', netVolume: '4.250' },
      { productId: 'ado', productName: 'ADO', productColor: 'green', netVolume: '21.900' },
    ])).toEqual([
      { productId: 'ado', productName: 'ADO', productColor: 'green', netVolume: '30.000' },
      { productId: 'xtr', productName: 'XTR', productColor: 'orange', netVolume: '4.250' },
    ])
  })

  it('keeps product identities separate and preserves zero totals', () => {
    expect(summarizeDisposalsByProduct([
      { productId: 'ado-1', productName: 'ADO', productColor: 'gray', netVolume: '0' },
      { productId: 'ado-2', productName: 'ADO', productColor: 'red', netVolume: '1.234' },
    ])).toEqual([
      { productId: 'ado-1', productName: 'ADO', productColor: 'gray', netVolume: '0.000' },
      { productId: 'ado-2', productName: 'ADO', productColor: 'red', netVolume: '1.234' },
    ])
  })

  it.each([null, undefined, '', 'invalid', '-1', 'Infinity'])(
    'does not expose a partial product total when a reading is %s',
    (netVolume) => {
      expect(summarizeDisposalsByProduct([
        { productId: 'ado', productName: 'ADO', productColor: 'yellow', netVolume: '10' },
        { productId: 'ado', productName: 'ADO', productColor: 'yellow', netVolume },
        { productId: 'xtr', productName: 'XTR', productColor: 'green', netVolume: '2' },
      ])).toEqual([
        { productId: 'ado', productName: 'ADO', productColor: 'yellow', netVolume: undefined },
        { productId: 'xtr', productName: 'XTR', productColor: 'green', netVolume: '2.000' },
      ])
    },
  )
})
