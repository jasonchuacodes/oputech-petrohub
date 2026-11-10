import type { Session } from './auth.types'

export function getAuthenticatedRedirect(session: Session, pathname: string): string | null {
  if (!session.user.currentTenantId && pathname !== '/onboarding') return '/onboarding'
  if (session.user.currentTenantId && pathname === '/onboarding') return '/home'
  return null
}

export function getUserLandingPath(session: Session): string {
  return session.user.currentTenantId ? '/home' : '/onboarding'
}
