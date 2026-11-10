import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../auth/auth-context'
import { useLogoutMutation } from '../auth/auth.queries'
import { useCreateTenantMutation } from '../tenants/tenants.queries'
import { OnboardingPage } from './onboarding-page'

vi.mock('../auth/auth-context', () => ({ useAuth: vi.fn() }))
vi.mock('../auth/auth.queries', () => ({ useLogoutMutation: vi.fn() }))
vi.mock('../tenants/tenants.queries', () => ({ useCreateTenantMutation: vi.fn() }))

const mockedUseAuth = vi.mocked(useAuth)
const mockedUseLogoutMutation = vi.mocked(useLogoutMutation)
const mockedUseCreateTenantMutation = vi.mocked(useCreateTenantMutation)

describe('OnboardingPage', () => {
  const activateTenant = vi.fn<(tenantId: string) => void>()
  const mutateAsync = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    window.localStorage.clear()
    mutateAsync.mockResolvedValue({
      id: 'tenant-1',
      name: 'Main Station',
      timezone: 'Asia/Manila',
      currency: 'PHP',
    })
    mockedUseAuth.mockReturnValue({
      status: 'authenticated',
      session: {
        user: {
          id: 'user-1',
          username: 'owner',
          status: 'active',
          role: 'superadmin',
          tenantIds: [],
          tenantSelectionVersion: 0,
          shouldChangePassword: false,
        },
        tenantAccess: [],
      },
      generation: 1,
      sessionError: null,
      login: vi.fn(),
      logout: vi.fn(),
      activateTenant,
      changePassword: vi.fn(),
    })
    mockedUseCreateTenantMutation.mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateTenantMutation>)
    mockedUseLogoutMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useLogoutMutation>)
  })

  it('creates the first tenant and continues to reports', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <Routes>
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route path="reports" element={<div>Reports page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    const submit = screen.getByRole('button', { name: 'Create and continue' })
    expect(submit).toBeDisabled()

    await user.type(screen.getByLabelText('Tenant name'), 'Main Station')
    await user.click(submit)

    expect(mutateAsync).toHaveBeenCalledWith('Main Station')
    expect(activateTenant).toHaveBeenCalledWith('tenant-1')
    expect(window.localStorage.getItem('petromate:active-tenant')).toBe('tenant-1')
    expect(await screen.findByText('Reports page')).toBeInTheDocument()
  })
})
