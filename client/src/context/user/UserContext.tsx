import type { ReactNode } from 'react';
import { createContext } from 'react';
import type { User } from '../../services/user/user.types';

type UserContextType = {
  user: User;
  userId: string;
};

type UserProviderProps = {
  userId: string;
  user: User;
  children: ReactNode;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ user, userId, children }: UserProviderProps) => {
  return <UserContext.Provider value={{ user, userId }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
