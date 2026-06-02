import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUserApi } from "../api/auth";
import { AuthContext } from "./auth-context";
import type { User } from "../types";


function readToken(): string | null {
  return sessionStorage.getItem("token");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(readToken()));

  useEffect(() => {
    const token = readToken();
    if (!token) return;
    let cancelled = false;

    const fetchUser = async () => {
      try {
        const res = await getCurrentUserApi();
        if (!cancelled) {
          return setUser(res.user);
        }

      } catch {
        sessionStorage.removeItem("token");
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchUser()
    return () => { cancelled = true; };
  }, []);

  const login = useCallback((token: string, user: User) => {
    sessionStorage.setItem("token", token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("token");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, logout, setUser }),
    [user, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}