import { Navigate } from 'react-router-dom';

import { LoadingSpinner } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';

export const BootstrapPage = () => {
  const { auth, loading } = useAuthContext();

  if (loading) return <LoadingSpinner />;

  if (!auth || !auth?.hasTenant) return <Navigate to="/create-tenant" replace />;

  return <Navigate to="/" replace={true} />;
};
