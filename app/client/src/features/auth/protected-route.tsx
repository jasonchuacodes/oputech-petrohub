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

  if (session.isError) return <Navigate to="/login" replace />
  if (session.data.user.shouldChangePassword && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />
  }
  if (!session.data.user.shouldChangePassword && location.pathname === '/change-password') {
    return <Navigate to="/reports" replace />
  }
  return <Outlet />
}
