import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { AccountSettingsPage } from '.'

const mocks = vi.hoisted(() => ({
  changePassword: { isPending: false, mutateAsync: vi.fn() },
  profile: {
    data: {
      id: 'user-id',
      firstName: 'Pat',
      lastName: 'Member',
      fullName: 'Pat Member',
      username: 'pat-member',
      role: 'member' as const,
      sss: '00-123',
      pagibig: '01-234',
      philhealth: '02-345',
      tin: '000-111',
      birthday: '2000-02-29',
      address: 'Station Road',
    },
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  },
  session: {
    data: {
      tenantAccess: [{ tenantId: 'tenant-id', role: 'member' as const }],
      user: {
        id: 'user-id',
        fullName: 'Pat Member',
        username: 'pat-member',
        status: 'active',
        role: 'member' as const,
        tenantIds: ['tenant-id'],
        currentTenantId: 'tenant-id',
        tenantSelectionVersion: 0,
      },
    },
  },
  updateProfile: { isPending: false, mutateAsync: vi.fn() },
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}))

vi.mock('../../auth/auth.queries', () => ({
  useChangePasswordMutation: () => mocks.changePassword,
  useSessionQuery: () => mocks.session,
}))

vi.mock('../account.queries', () => ({
  useMyProfileQuery: () => mocks.profile,
  useUpdateMyProfileMutation: () => mocks.updateProfile,
}))

describe('AccountSettingsPage', () => {
  it('shows all profile fields and represents username as read-only', () => {
    const html = renderToStaticMarkup(<AccountSettingsPage />)

    expect(html).toMatch(/<input[^>]*id="profile-username"[^>]*readonly=""/)
    expect(html).toContain('aria-readonly="true"')
    expect(html).not.toContain('Your administrator controls this login username.')
    expect(html).toContain('Personal information')
    expect(html).toContain('Government IDs')
    expect(html).toContain('Pag-IBIG')
    expect(html).toContain('PhilHealth')
    expect(html).toContain('TIN')
  })
})
