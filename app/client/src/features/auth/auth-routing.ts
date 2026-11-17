import type { Session } from './auth.types'

export function getAuthenticatedRedirect(session: Session, pathname: string): string | null {
  const landingPath = getUserLandingPath(session)
  if (landingPath === '/onboarding' && pathname !== '/onboarding') return '/onboarding'
  if (landingPath === '/home' && pathname === '/onboarding') return '/home'
  return null
}

export function getUserLandingPath(session: Session): string {
  return session.tenantAccess.length > 0 ? '/home' : '/onboarding'
}
