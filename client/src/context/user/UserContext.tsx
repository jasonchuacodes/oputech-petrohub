import type { ReactNode } from 'react';
import { createContext } from 'react';

type UserContextType = {
  userId: string;
};

type UserProviderProps = {
  userId: string;
  children: ReactNode;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ userId, children }: UserProviderProps) => {
  return <UserContext.Provider value={{ userId }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider}
