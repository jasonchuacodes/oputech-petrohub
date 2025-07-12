import { createContext, useEffect, useState, type ReactNode } from 'react';

import { getMe } from '~/services/auth/auth.api';
import type { User } from '~/services/user/user.types';

type AuthContextType = {
  auth: User | null;
  setAuth: (newvalue: User | null) => void;
  loading: boolean;
};

const initialState = {
  auth: null,
  setAuth: () => {},
  loading: true,
};

const AuthContext = createContext<AuthContextType>(initialState);

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [auth, setAuth] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await getMe();

        setAuth(user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return <AuthContext.Provider value={{ auth, setAuth, loading }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
