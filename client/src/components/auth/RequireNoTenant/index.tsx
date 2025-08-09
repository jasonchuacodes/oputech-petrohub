import { Navigate, Outlet } from 'react-router-dom';

import { LoadingScreen } from '~/components/layouts/admin/LoadingScreen';
import { useAuthContext } from '~/context/auth/useAuthContext';

export const RequireNoTenant = () => {
  const { auth, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;

  if (auth?.hasTenant) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
