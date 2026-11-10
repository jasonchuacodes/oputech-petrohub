import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSessionQuery } from './auth.queries'
import { ProtectedRoute } from './protected-route'

vi.mock('./auth.queries', () => ({ useSessionQuery: vi.fn() }))

const mockedSessionQuery = vi.mocked(useSessionQuery)

function renderRoutes(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="reports" element={<div>Reports page</div>} />
          <Route path="change-password" element={<div>Change password page</div>} />
          <Route path="onboarding" element={<div>Onboarding page</div>} />
        </Route>
        <Route path="login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => vi.resetAllMocks())
  afterEach(cleanup)

  it('forces temporary-password users into the password flow', async () => {
    mockedSessionQuery.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        user: {
          id: 'user-1',
          firstName: 'Station',
          lastName: 'Admin',
          displayFullName: 'Station Admin',
          username: 'admin',
          status: 'active',
          role: 'admin',
          shouldChangePassword: true,
        },
        tenantAccess: [],
      },
    } as unknown as ReturnType<typeof useSessionQuery>)

    renderRoutes('/reports')
    expect(await screen.findByText('Change password page')).toBeInTheDocument()
  })

  it('keeps established users out of the temporary-password flow', async () => {
    mockedSessionQuery.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        user: {
          id: 'user-1',
          firstName: 'Station',
          lastName: 'Admin',
          displayFullName: 'Station Admin',
          username: 'admin',
          status: 'active',
          role: 'admin',
          currentTenantId: 'tenant-1',
          shouldChangePassword: false,
        },
        tenantAccess: [],
      },
    } as unknown as ReturnType<typeof useSessionQuery>)

    renderRoutes('/change-password')
    expect(await screen.findByText('Reports page')).toBeInTheDocument()
  })

  it('routes a new superadmin without a tenant into onboarding', async () => {
    mockedSessionQuery.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        user: {
          id: 'user-1',
          username: 'owner',
          status: 'active',
          role: 'superadmin',
          shouldChangePassword: false,
        },
        tenantAccess: [],
      },
    } as unknown as ReturnType<typeof useSessionQuery>)

    renderRoutes('/reports')
    expect(await screen.findByText('Onboarding page')).toBeInTheDocument()
  })

  it('keeps users with a tenant out of onboarding', async () => {
    mockedSessionQuery.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        user: {
          id: 'user-1',
          username: 'owner',
          status: 'active',
          role: 'superadmin',
          currentTenantId: 'tenant-1',
          shouldChangePassword: false,
        },
        tenantAccess: [{ tenantId: 'tenant-1', role: 'superadmin' }],
      },
    } as unknown as ReturnType<typeof useSessionQuery>)

    renderRoutes('/onboarding')
    expect(await screen.findByText('Reports page')).toBeInTheDocument()
  })
})
