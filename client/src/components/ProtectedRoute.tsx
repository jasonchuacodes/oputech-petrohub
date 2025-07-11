import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // TODO: replace this with auth flow
  const isAuthenticated = false;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
