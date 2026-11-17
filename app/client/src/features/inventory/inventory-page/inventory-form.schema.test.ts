import { describe, expect, it } from 'vitest'
import { reconcileCountFormSchema } from './inventory-form.schema'

describe('inventory count reconciliation form', () => {
  it('accepts nonnegative whole counts and an optional note', () => {
    expect(reconcileCountFormSchema.safeParse({ stockCount: '0', note: '' }).success).toBe(true)
    expect(reconcileCountFormSchema.safeParse({ stockCount: '12', note: 'Counted stock' }).success).toBe(true)
  })

  it('rejects negative or fractional counts', () => {
    expect(reconcileCountFormSchema.safeParse({ stockCount: '-1', note: '' }).success).toBe(false)
    expect(reconcileCountFormSchema.safeParse({ stockCount: '1.5', note: '' }).success).toBe(false)
  })

  it('requires at least three characters when a note is supplied', () => {
    expect(reconcileCountFormSchema.safeParse({ stockCount: '1', note: 'x' }).success).toBe(false)
    expect(reconcileCountFormSchema.parse({ stockCount: '1', note: '  audit count  ' }).note).toBe('audit count')
  })
})
