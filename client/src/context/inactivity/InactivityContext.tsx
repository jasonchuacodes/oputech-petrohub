import { useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useInactivityTimer } from '~/hooks/useInactivityTimer';
import { useLogoutMutation } from '~/services/auth/auth.queries';
import { UserRole } from '~/services/user/user.types';

import { useAuthContext } from '../auth/useAuthContext';

type InactivityContextType = {
  isWarningShown: boolean;
  remainingSeconds: number;
  resetTimer: () => void;
};

const InactivityContext = createContext<InactivityContextType | undefined>(undefined);

type InactivityProviderProps = {
  children: ReactNode;
};

const InactivityProvider = ({ children }: InactivityProviderProps) => {
  const { auth, setIsLoading } = useAuthContext();
  const { mutate: logout } = useLogoutMutation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isInactivityTimerEnabled = auth?.role === UserRole.USER

  const handleAutoLogout = useCallback(() => {
    setIsLoading(true);

    logout(undefined, {
      onSettled: () => {
        sessionStorage.clear();
        
        queryClient.setQueryData(['auth'], null);
        queryClient.cancelQueries();

        navigate('/login');
        setIsLoading(false);
      },
    });
  }, [logout, queryClient, navigate, setIsLoading]);

  const timer = useInactivityTimer({
    enabled: isInactivityTimerEnabled,
    onTimeout: handleAutoLogout,
  });

  return <InactivityContext.Provider value={timer}>{children}</InactivityContext.Provider>;
};

export { InactivityContext, InactivityProvider };
