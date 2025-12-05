import type { ReactNode } from 'react';
import { createContext } from 'react';

import { useInactivityTimer } from '~/hooks/useInactivityTimer';
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
  const { auth, logout } = useAuthContext();

  const isInactivityTimerEnabled = auth?.role === UserRole.USER;

  const timer = useInactivityTimer({
    enabled: isInactivityTimerEnabled,
    onTimeout: logout,
  });

  return <InactivityContext.Provider value={timer}>{children}</InactivityContext.Provider>;
};

export { InactivityContext, InactivityProvider };
