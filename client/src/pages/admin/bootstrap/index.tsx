import { Navigate } from 'react-router-dom';

import { LoadingScreen } from '~/components/layouts/LoadingScreen';
import { useAuthContext } from '~/context/auth/useAuthContext';

export const BootstrapPage = () => {
  const { auth, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;

  if (!auth) return <Navigate to="/login" replace />;

  return auth.hasTenant ? (
    <Navigate to={`/tenants/${auth.tenants[0].id}`} replace />
  ) : (
    <Navigate to="/create-tenant" replace />
  );
};
