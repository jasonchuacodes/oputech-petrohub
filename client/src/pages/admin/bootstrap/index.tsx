import { Navigate } from 'react-router-dom';

import { LoadingScreen } from '~/components/layouts/admin/LoadingScreen';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { AdminRoutes, PublicRoutes } from '~/routes';
import { useGetTenantsQuery } from '~/services/tenant/tenant.queries';
import { pathFor } from '~/utils/pathFor';

export const BootstrapPage = () => {
  const { auth, loading: isLoadingAuth } = useAuthContext();

  const { data: tenants, isLoading: isLoadingTenants } = useGetTenantsQuery();

  if (isLoadingAuth || isLoadingTenants) {
    return <LoadingScreen />;
  }

  if (!auth) {
    return (
      <Navigate
        to={pathFor({
          pathname: PublicRoutes.Login,
        })}
        replace
      />
    );
  }

  if (!tenants || tenants.length === 0) {
    return (
      <Navigate
        to={pathFor({
          pathname: AdminRoutes.TenantCreateFlow,
        })}
        replace
      />
    );
  }

  // tenants are sorted by createdAt DESC from the API, so tenants[0] is most recently created
  const accessibleIds = new Set(tenants.map((t) => t.id));

  const targetTenantId =
    auth.lastTenantId && accessibleIds.has(auth.lastTenantId)
      ? auth.lastTenantId
      : tenants[0].id;

  return (
    <Navigate
      to={pathFor({
        pathname: AdminRoutes.TenantHome,
        params: { tenantId: targetTenantId },
      })}
      replace
    />
  );
};
