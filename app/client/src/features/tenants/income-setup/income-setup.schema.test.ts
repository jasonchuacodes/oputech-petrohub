import { describe, expect, it } from 'vitest'
import { incomeSetupFormSchema } from './income-setup.schema'

describe('income setup form', () => {
  it('normalizes field descriptions', () => {
    const result = incomeSetupFormSchema.parse({
      fields: [{ id: null, description: '  Fleet   Card ', active: true }],
    })
    expect(result.fields[0].description).toBe('Fleet Card')
  })

  it('rejects duplicate descriptions so archived fields retain one identity', () => {
    expect(incomeSetupFormSchema.safeParse({
      fields: [
        { id: '1', description: 'PayMaya', active: true },
        { id: '2', description: 'paymaya', active: true },
      ],
    }).success).toBe(false)
    expect(incomeSetupFormSchema.safeParse({
      fields: [
        { id: '1', description: 'PayMaya', active: true },
        { id: '2', description: 'paymaya', active: false },
      ],
    }).success).toBe(false)
  })
})
