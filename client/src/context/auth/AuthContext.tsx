import { createContext, type ReactNode } from 'react';

import { useGetMe } from '~/services/auth/auth.queries';
import type { User } from '~/services/user/user.types';

type AuthContextType = {
  auth?: User | null;
  loading: boolean;
  refetch: () => void;
};

const initialState = {
  auth: null,
  loading: true,
  refetch: () => null,
};

const AuthContext = createContext<AuthContextType>(initialState);

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const { data: auth, isLoading: loading, refetch } = useGetMe();

  return <AuthContext.Provider value={{ auth, loading, refetch }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
