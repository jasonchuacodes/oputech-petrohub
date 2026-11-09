import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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
        </Route>
        <Route path="login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => vi.resetAllMocks())

  it('forces temporary-password users into the password flow', async () => {
    mockedSessionQuery.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        user: {
          id: 'user-1',
          displayName: 'Station Admin',
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
          displayName: 'Station Admin',
          username: 'admin',
          status: 'active',
          role: 'admin',
          shouldChangePassword: false,
        },
        tenantAccess: [],
      },
    } as unknown as ReturnType<typeof useSessionQuery>)

    renderRoutes('/change-password')
    expect(await screen.findByText('Reports page')).toBeInTheDocument()
  })
})
