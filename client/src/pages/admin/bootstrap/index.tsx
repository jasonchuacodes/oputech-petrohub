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

  // TODO: implement tenantSelection page for tenants.length > 1
  return (
    <Navigate
      to={pathFor({
        pathname: AdminRoutes.TenantHome,
        params: { tenantId: tenants[0].id },
      })}
      replace
    />
  );
};
