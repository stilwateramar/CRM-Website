import React, { createContext, useContext, useEffect, useState } from 'react';
import { Principal, fetchMe, setStillwaterToken } from './api/client';

interface AuthCtx {
  user: Principal | null;
  loading: boolean;
  setUser: (u: Principal | null) => void;
  signIn: (token: string, user: Principal) => void;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  setUser: () => {},
  signIn: () => {},
  signOut: () => {},
});

export function StillwaterAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Principal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  const signIn = (token: string, u: Principal) => {
    setStillwaterToken(token);
    setUser(u);
  };

  const signOut = () => {
    setStillwaterToken(null);
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, setUser, signIn, signOut }}>{children}</Ctx.Provider>
  );
}

export function useStillwaterAuth() {
  return useContext(Ctx);
}
