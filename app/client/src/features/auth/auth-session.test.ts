import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthApiError, refreshSession } from './auth.api'
import { AuthSession } from './auth-session'
import type { SessionResponse } from './auth.types'

vi.mock('./auth.api', async () => {
  const actual = await vi.importActual<typeof import('./auth.api')>('./auth.api')
  return {
    ...actual,
    changePasswordRequest: vi.fn(),
    loginSession: vi.fn(),
    logoutSession: vi.fn(),
    refreshSession: vi.fn(),
  }
})

const mockedRefreshSession = vi.mocked(refreshSession)

describe('AuthSession persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('restores a session from the refresh cookie during bootstrap', async () => {
    const session = new AuthSession()
    mockedRefreshSession.mockResolvedValue(sessionResponse('initial-token'))

    await session.bootstrap()

    expect(session.getSnapshot()).toMatchObject({
      status: 'authenticated',
      session: { user: { username: 'member' } },
    })
  })

  it('retries session restoration after bootstrap is temporarily unavailable', async () => {
    const session = new AuthSession()
    mockedRefreshSession.mockRejectedValueOnce(new AuthApiError(503))

    await session.bootstrap()
    expect(session.getSnapshot()).toMatchObject({ status: 'unavailable', session: null })

    mockedRefreshSession.mockResolvedValueOnce(sessionResponse('restored-token'))
    await session.resume()

    expect(session.getSnapshot()).toMatchObject({
      status: 'authenticated',
      session: { user: { username: 'member' } },
    })
  })

  it('retains the known session after a temporary refresh failure and recovers on resume', async () => {
    const session = new AuthSession()
    mockedRefreshSession.mockResolvedValueOnce(sessionResponse('expired-token', -1))
    await session.bootstrap()
    mockedRefreshSession.mockRejectedValueOnce(new AuthApiError(0))

    await expect(session.getAccessToken()).rejects.toBeInstanceOf(AuthApiError)
    expect(session.getSnapshot()).toMatchObject({
      status: 'unavailable',
      session: { user: { username: 'member' } },
    })

    mockedRefreshSession.mockResolvedValueOnce(sessionResponse('rotated-token'))
    await session.resume()

    expect(session.getSnapshot().status).toBe('authenticated')
    await expect(session.getAccessToken()).resolves.toBe('rotated-token')
  })

  it('clears the session when refresh confirms that it is invalid', async () => {
    const session = new AuthSession()
    mockedRefreshSession.mockResolvedValueOnce(sessionResponse('expired-token', -1))
    await session.bootstrap()
    mockedRefreshSession.mockRejectedValueOnce(new AuthApiError(401))

    await expect(session.getAccessToken()).rejects.toBeInstanceOf(AuthApiError)

    expect(session.getSnapshot()).toMatchObject({
      status: 'anonymous',
      session: null,
      sessionError: 'invalid-session',
    })
  })

  it('does not rotate a valid access token when the app resumes', async () => {
    const session = new AuthSession()
    mockedRefreshSession.mockResolvedValueOnce(sessionResponse('valid-token'))
    await session.bootstrap()

    await session.resume()

    expect(mockedRefreshSession).toHaveBeenCalledTimes(1)
  })
})

function sessionResponse(accessToken: string, expiresInMinutes = 5): SessionResponse {
  return {
    accessToken,
    dateTimeExpiration: new Date(Date.now() + expiresInMinutes * 60_000).toISOString(),
    tokenType: 'access',
    user: {
      id: 'user-id',
      fullName: 'Test Member',
      username: 'member',
      status: 'active',
      role: 'member',
      tenantIds: ['tenant-id'],
      currentTenantId: 'tenant-id',
      tenantSelectionVersion: 1,
    },
    tenantAccess: [{ tenantId: 'tenant-id', role: 'member' }],
  }
}
