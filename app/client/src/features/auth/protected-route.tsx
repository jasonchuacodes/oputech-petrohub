import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spinner } from '~/components/ui/spinner'
import { useSessionQuery } from './auth.queries'

export function ProtectedRoute() {
  const session = useSessionQuery()
  const location = useLocation()

  if (session.isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (session.isError || !session.data) return <Navigate to="/login" replace />
  if (session.data.user.shouldChangePassword) {
    return location.pathname === '/change-password' ? (
      <Outlet />
    ) : (
      <Navigate to="/change-password" replace />
    )
  }
  if (location.pathname === '/change-password') {
    return (
      <Navigate
        to={session.data.user.currentTenantId ? '/home' : '/onboarding'}
        replace
      />
    )
  }
  if (!session.data.user.currentTenantId && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }
  if (session.data.user.currentTenantId && location.pathname === '/onboarding') {
    return <Navigate to="/home" replace />
  }
  return <Outlet />
}
