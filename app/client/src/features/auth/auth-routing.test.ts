import { describe, expect, it } from 'vitest'
import type { Session } from './auth.types'
import { getAuthenticatedRedirect, getUserLandingPath } from './auth-routing'

const createSession = (
  {
    user: userOverrides = {},
    tenantAccess = [],
  }: {
    user?: Partial<Session['user']>
    tenantAccess?: Session['tenantAccess']
  } = {},
): Session => ({
  tenantAccess,
  user: {
    id: 'user-id',
    fullName: 'operator',
    username: 'operator',
    status: 'active',
    role: 'member',
    tenantIds: [],
    tenantSelectionVersion: 0,
    ...userOverrides,
  },
})

describe('authentication routing', () => {
  it('sends users without a tenant to onboarding', () => {
    const session = createSession()

    expect(getUserLandingPath(session)).toBe('/onboarding')
    expect(getAuthenticatedRedirect(session, '/home')).toBe('/onboarding')
    expect(getAuthenticatedRedirect(session, '/onboarding')).toBeNull()
  })

  it('sends users with tenant access to the private application', () => {
    const session = createSession({
      tenantAccess: [{ tenantId: 'tenant-id', role: 'superadmin' }],
      user: { role: 'superadmin', tenantIds: [] },
    })

    expect(getUserLandingPath(session)).toBe('/home')
    expect(getAuthenticatedRedirect(session, '/home')).toBeNull()
    expect(getAuthenticatedRedirect(session, '/reports')).toBeNull()
    expect(getAuthenticatedRedirect(session, '/onboarding')).toBe('/home')
  })

  it('does not use a stale tenant selection as proof of access', () => {
    const session = createSession({ user: { currentTenantId: 'stale-tenant-id' } })

    expect(getUserLandingPath(session)).toBe('/onboarding')
    expect(getAuthenticatedRedirect(session, '/home')).toBe('/onboarding')
    expect(getAuthenticatedRedirect(session, '/onboarding')).toBeNull()
  })
})
