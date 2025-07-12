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

  return <PageLayout>{auth ? <Outlet /> : <Navigate to="/login" replace />}</PageLayout>;
};

export default ProtectedRoute;
