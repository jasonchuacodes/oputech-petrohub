import { Navigate, Outlet } from 'react-router-dom';

import { LoadingSpinner } from '~/components/ui/LoadingSpinner';
import { useAuthContext } from '~/context/auth/useAuthContext';

import { PageLayout } from './layouts';

const ProtectedRoute = () => {
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

export default ProtectedRoute;
