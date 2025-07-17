import { Navigate } from 'react-router-dom';

import { useAuthContext } from '~/context/auth/useAuthContext';

export const BootstrapPage = () => {
  const { auth } = useAuthContext();

  // TODO: check for auth.hasTenant
  if (true) return <Navigate to="/create-tenant" replace />;

  return <Navigate to="/" replace={true} />;
};
