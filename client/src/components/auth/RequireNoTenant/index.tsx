import { Navigate, Outlet } from 'react-router-dom';

import { LoadingSpinner, PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';

export const RequireNoTenant = () => {
  const { auth, loading } = useAuthContext();

  if (loading)
    return (
      <PageLayout justifyContent="center" alignItems="center">
        <LoadingSpinner />
      </PageLayout>
    );

  if (auth?.hasTenant) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
