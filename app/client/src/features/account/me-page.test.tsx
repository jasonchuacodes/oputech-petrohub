import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Session } from '../auth/auth.types'
import { navigation } from '../layout/navigation'
import { MePage } from './me-page'

const authMocks = vi.hoisted(() => ({
  logout: { isPending: false, mutate: vi.fn() },
  session: { data: undefined as Session | undefined },
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('../auth/auth.queries', () => ({
  useLogoutMutation: () => authMocks.logout,
  useSessionQuery: () => authMocks.session,
}))

function renderPage(role: Session['user']['role'] = 'admin') {
  authMocks.session.data = {
    tenantAccess: [],
    user: {
      id: 'user-id',
      fullName: 'Pat Manager',
      username: 'pat',
      status: 'active',
      role,
      tenantIds: ['tenant-id'],
      currentTenantId: 'tenant-id',
      tenantSelectionVersion: 0,
    },
  }

  return renderToStaticMarkup(<MePage />)
}

describe('MePage', () => {
  beforeEach(() => {
    authMocks.logout.isPending = false
    authMocks.logout.mutate.mockClear()
  })

  it.each(['admin', 'superadmin'] as const)(
    'groups management links for a %s',
    (role) => {
      const html = renderPage(role)
      const expectedContent = [
        'Station',
        'Fuel setup',
        'Inventory',
        'Shifts',
        'Report setup',
        'Administration',
        'Users',
        'Tenants',
      ]
      const expectedLinks = [
        '/fuel-setup',
        '/inventory',
        '/shifts',
        '/income-setup',
        '/users',
        '/tenants',
      ]

      expectedContent.forEach((content) => expect(html).toContain(content))
      expectedLinks.forEach((href) => expect(html).toContain(`href="${href}"`))
      expectedContent.slice(1).reduce((previousIndex, content) => {
        const index = html.indexOf(content)
        expect(index).toBeGreaterThan(previousIndex)
        return index
      }, html.indexOf(expectedContent[0]))
    },
  )

  it('keeps timesheets in primary navigation instead of duplicating them', () => {
    const html = renderPage()

    expect(html).not.toContain('href="/timesheet"')
    expect(navigation).toContainEqual(expect.objectContaining({ label: 'Timesheet', href: '/timesheet' }))
  })

  it('does not render empty management sections for members', () => {
    const html = renderPage('member')

    expect(html).not.toContain('Station')
    expect(html).not.toContain('Administration')
    expect(html).not.toContain('/inventory')
    expect(html).toContain('href="/account"')
    expect(html).toContain('Sign out')
  })

  it('preserves the pending sign-out state', () => {
    authMocks.logout.isPending = true
    const html = renderPage()

    expect(html).toContain('disabled=""')
    expect(html).toContain('Signing out…')
  })
})
