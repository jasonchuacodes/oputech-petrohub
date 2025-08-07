import { Navigate, Outlet } from 'react-router-dom';

import { LoadingScreen } from '~/components/layouts/LoadingScreen';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { UserRoleEnum, type UserRole } from '~/services/user/user.types';

type ProtectedRouteProps = {
  allowedRoles: UserRole[];
};

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { auth, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;

  if (!auth) return <Navigate to="/login" replace />;
  
  if (!allowedRoles.includes(auth.role)) {
    if (auth.role === UserRoleEnum.ADMIN) {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};
