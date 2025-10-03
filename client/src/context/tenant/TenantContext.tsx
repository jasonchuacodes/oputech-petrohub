import { createContext, useState, type Dispatch, type SetStateAction } from 'react';
import { useParams } from 'react-router-dom';

import type { Tenant } from '../../services/tenant/tenant.types';

type TenantType = {
  tenantId?: string;
  tenant: Tenant | null;
  setTenant: Dispatch<SetStateAction<Tenant | null>>;
};

const initialState: TenantType = {
  tenantId: undefined,
  tenant: null,
  setTenant: () => {}, // noop default
};

const TenantContext = createContext<TenantType>(initialState);

const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const { tenantId } = useParams();
  const [tenant, setTenant] = useState<Tenant | null>(null);

  return (
    <TenantContext.Provider value={{ tenantId, tenant, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export { TenantContext, TenantProvider };
