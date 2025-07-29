import { Navigate } from 'react-router-dom';

import { LoadingSpinner, PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';

export const BootstrapPage = () => {
  const { auth, loading } = useAuthContext();

  if (loading)
    return (
      <PageLayout justifyContent="center" alignItems="center" height="100vh">
        <LoadingSpinner />
      </PageLayout>
    );

  if (!auth) return <Navigate to="/login" replace />;

  return auth.hasTenant ? (
    <Navigate to={`/tenants/${auth.tenants[0].id}`} replace />
  ) : (
    <Navigate to="/create-tenant" replace />
  );
};
