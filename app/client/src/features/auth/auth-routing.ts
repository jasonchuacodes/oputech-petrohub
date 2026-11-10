import type { Session } from './auth.types'

export function getAuthenticatedRedirect(session: Session, pathname: string): string | null {
  if (session.user.shouldChangePassword) {
    return pathname === '/change-password' ? null : '/change-password'
  }
  if (pathname === '/change-password') {
    return session.user.currentTenantId ? '/home' : '/onboarding'
  }
  if (!session.user.currentTenantId && pathname !== '/onboarding') return '/onboarding'
  if (session.user.currentTenantId && pathname === '/onboarding') return '/home'
  return null
}

export function getUserLandingPath(session: Session): string {
  if (session.user.shouldChangePassword) return '/change-password'
  return session.user.currentTenantId ? '/home' : '/onboarding'
}
