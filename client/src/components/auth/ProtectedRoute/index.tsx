import { Navigate, Outlet } from 'react-router-dom';

import { LoadingSpinner, PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';

export const ProtectedRoute = () => {
  const { auth, loading } = useAuthContext();
  
  if (loading)
    return (
      <PageLayout justifyContent="center" alignItems="center">
        <LoadingSpinner />
      </PageLayout>
    );

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
