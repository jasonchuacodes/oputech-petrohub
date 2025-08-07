import { Navigate, Outlet } from 'react-router-dom';

import { LoadingScreen } from '~/components/layouts/LoadingScreen';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { Routes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

export const RequireTenant = () => {
  const { auth, loading } = useAuthContext();
  const { tenantId } = useTenantContext();

  if (loading) return <LoadingScreen />;

  const hasTenantAccess = auth?.tenants?.some((tenant) => tenant.id === tenantId);
  const fallbackTenant = auth?.tenants[0];

  if (!hasTenantAccess) {
    return fallbackTenant ? (
      <Navigate
        to={pathFor({
          pathname: Routes.TenantHome,
          params: { tenantId: fallbackTenant.id },
        })}
        replace
      />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return <Outlet />;
};
