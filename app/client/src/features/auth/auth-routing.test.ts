import { describe, expect, it } from 'vitest'
import type { Session } from './auth.types'
import { getAuthenticatedRedirect, getUserLandingPath } from './auth-routing'

const createSession = (
  overrides: Partial<Session['user']> = {},
): Session => ({
  tenantAccess: [],
  user: {
    id: 'user-id',
    username: 'operator',
    status: 'active',
    role: 'member',
    tenantIds: [],
    tenantSelectionVersion: 0,
    ...overrides,
  },
})

describe('authentication routing', () => {
  it('sends users without a tenant to onboarding', () => {
    const session = createSession()

    expect(getUserLandingPath(session)).toBe('/onboarding')
    expect(getAuthenticatedRedirect(session, '/home')).toBe('/onboarding')
    expect(getAuthenticatedRedirect(session, '/onboarding')).toBeNull()
  })

  it('sends fully configured users to the private application', () => {
    const session = createSession({ currentTenantId: 'tenant-id' })

    expect(getUserLandingPath(session)).toBe('/home')
    expect(getAuthenticatedRedirect(session, '/home')).toBeNull()
    expect(getAuthenticatedRedirect(session, '/onboarding')).toBe('/home')
  })
})
