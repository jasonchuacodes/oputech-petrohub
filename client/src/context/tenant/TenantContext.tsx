import { createContext } from 'react';
import { useParams } from 'react-router-dom';

type TenantType = {
  tenantId?: string;
};

const initialState = {
  tenantId: undefined,
};

const TenantContext = createContext<TenantType>(initialState);

const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const { tenantId } = useParams();

  return <TenantContext.Provider value={{ tenantId }}>{children}</TenantContext.Provider>;
};

export { TenantContext, TenantProvider };
