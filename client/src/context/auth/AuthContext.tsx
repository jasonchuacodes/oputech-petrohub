import { createContext, useState, type ReactNode } from 'react';

type Auth = {
  token: string | null;
};

type AuthContextType = {
  auth: Auth | null;
  setAuth: (newvalue: Auth) => void;
};

const initialState = {
  auth: null,
  setAuth: () => {},
};

const AuthContext = createContext<AuthContextType>(initialState);

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [auth, setAuth] = useState<Auth | null>(null);

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
