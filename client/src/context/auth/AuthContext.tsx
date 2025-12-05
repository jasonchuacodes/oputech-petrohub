import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetMe, useLogoutMutation } from '~/services/auth/auth.queries';
import type { User } from '~/services/user/user.types';

type AuthContextType = {
  auth?: User | null;
  loading: boolean;
  refetch: () => void;
  logout: () => void;
};

const initialState = {
  auth: null,
  loading: true,
  refetch: () => null,
  logout: () => null,
};

const AuthContext = createContext<AuthContextType>(initialState);

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const { data: auth, isLoading, isFetching, refetch } = useGetMe();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending: isLoggingOut } = useLogoutMutation();

  const logout = useCallback(() => {
    mutate(undefined, {
      onSuccess: () => {
        sessionStorage.clear();
        
        queryClient.setQueryData(['auth'], null);
        queryClient.cancelQueries();

        navigate('/login');
      },
    });
  }, [mutate, queryClient, navigate]);

  const loading = isLoading || isFetching || isLoggingOut;

  return (
    <AuthContext.Provider value={{ auth, loading, refetch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
