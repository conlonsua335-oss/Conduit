import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUserApi } from "../api/auth";
import { AuthContext } from "./auth-context";
import type { User } from "../types";


function readToken(): string | null {
  return localStorage.getItem("token");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(readToken()));

  useEffect(() => {
    const token = readToken();
    if (!token) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await getCurrentUserApi();
        if (!cancelled) {
          console.log("user từ API: ", res.user)
          return setUser(res.user);
        }

      } catch {
        localStorage.removeItem("token");
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem("token", token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
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