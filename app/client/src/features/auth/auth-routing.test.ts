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
    shouldChangePassword: false,
    ...overrides,
  },
})

describe('authentication routing', () => {
  it('sends temporary-password users to the password flow', () => {
    const session = createSession({ shouldChangePassword: true })

    expect(getUserLandingPath(session)).toBe('/change-password')
    expect(getAuthenticatedRedirect(session, '/home')).toBe('/change-password')
    expect(getAuthenticatedRedirect(session, '/change-password')).toBeNull()
  })

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
    expect(getAuthenticatedRedirect(session, '/change-password')).toBe('/home')
  })
})
