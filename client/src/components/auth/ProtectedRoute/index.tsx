import { Navigate, Outlet } from 'react-router-dom';

import { LoadingScreen } from '~/components/layouts/admin/LoadingScreen';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { UserRole, type UserRole as UserRoleType } from '~/services/user/user.types';

type ProtectedRouteProps = {
  allowedRoles: UserRoleType[];
};

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { auth, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;

  if (!auth) return <Navigate to="/login" replace />;
  
  if (!allowedRoles.includes(auth.role)) {
    if (auth.role === UserRole.ADMIN) {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};
