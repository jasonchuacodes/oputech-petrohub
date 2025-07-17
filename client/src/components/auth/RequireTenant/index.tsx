import { Navigate, Outlet } from 'react-router-dom';

import { LoadingSpinner } from '~/components/ui/LoadingSpinner';
import { useAuthContext } from '~/context/auth/useAuthContext';

export const RequireTenant = () => {
  const { auth, loading } = useAuthContext();

  if (loading) return <LoadingSpinner />;

  if (!auth?.hasTenant) {
    return <Navigate to="/create-tenant" replace />;
  }

  return <Outlet />;
};
