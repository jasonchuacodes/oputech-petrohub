import { Navigate, Outlet } from 'react-router-dom';

import { LoadingScreen } from '~/components/layouts/admin/LoadingScreen';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { PublicRoutes } from '~/routes';
import { useGetTenantByIdQuery } from '~/services/tenant/tenant.queries';
import { pathFor } from '~/utils/pathFor';

export const RequireTenant = () => {
  const { tenantId } = useTenantContext();

  const { data: tenant, isLoading } = useGetTenantByIdQuery({
    tenantId,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!tenant) {
    return (
      <Navigate
        to={pathFor({
          pathname: PublicRoutes.Unauthorized,
        })}
        replace
      />
    );
  }

  return <Outlet />;
};
