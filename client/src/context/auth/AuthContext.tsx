import { createContext, useState, type ReactNode } from 'react';

import { useGetMe } from '~/services/auth/auth.queries';
import type { User } from '~/services/user/user.types';

type AuthContextType = {
  auth?: User | null;
  loading: boolean;
  refetch: () => void;
  setIsLoading: (value: boolean) => void;
};

const initialState = {
  auth: null,
  loading: true,
  refetch: () => null,
  setIsLoading: () => null,
};

const AuthContext = createContext<AuthContextType>(initialState);

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const { data: auth, isLoading: queryLoading, isFetching, refetch } = useGetMe();
  const [manualLoading, setIsLoading] = useState(false);

  const loading = queryLoading || isFetching || manualLoading;

  return (
    <AuthContext.Provider value={{ auth, loading, refetch, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
