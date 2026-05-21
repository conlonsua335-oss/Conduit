import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUserApi } from "../api/auth";
import { AuthContext } from "./auth-context";
import type { User } from "../types";


function readToken(): string | null {
  return localStorage.getItem("token");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = readToken();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(token));

  console.log("AuthProvider render:", {
    token: token,
    user: user,
    isLoading: isLoading
  });

  useEffect(() => {
    if (!token) return;
    if (user) return
    let cancelled = false;

    (async () => {
      try {
        const res = await getCurrentUserApi();
        console.log("fetch xong:", res);
        if (!cancelled) setUser(res.user);
      } catch (err) {
        console.log("fetch lỗi:", err);
        localStorage.removeItem("token");
        if (!cancelled) setUser(null);
      } finally {
        console.log("finally, cancelled:", cancelled);
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem("token", token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 