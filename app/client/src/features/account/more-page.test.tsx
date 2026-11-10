import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { useLogoutMutation, useSessionQuery } from '../auth/auth.queries'
import { MorePage } from './more-page'

vi.mock('../auth/auth.queries', () => ({
  useLogoutMutation: vi.fn(),
  useSessionQuery: vi.fn(),
}))

const mockedLogout = vi.mocked(useLogoutMutation)
const mockedSession = vi.mocked(useSessionQuery)

function renderPage(user: { username: string; displayFullName?: string }) {
  mockedLogout.mockReturnValue({
    isPending: false,
    mutate: vi.fn(),
  } as unknown as ReturnType<typeof useLogoutMutation>)
  mockedSession.mockReturnValue({
    data: { user },
  } as unknown as ReturnType<typeof useSessionQuery>)

  return render(
    <MemoryRouter>
      <MorePage />
    </MemoryRouter>,
  )
}

describe('MorePage', () => {
  it('shows the full name and username when a full name is available', () => {
    renderPage({ username: 'admin', displayFullName: 'Station Admin' })

    expect(screen.getByText('Station Admin')).toBeInTheDocument()
    expect(screen.getByText('@admin')).toBeInTheDocument()
  })

  it('shows the username once when no full name is available', () => {
    renderPage({ username: 'owner' })

    expect(screen.getAllByText('@owner')).toHaveLength(1)
  })
})
