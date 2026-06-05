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
  {
    //bản chất của useMemo
    // useMemo là 1 hook sử dụng để lưu trữ dữ liệu
    // vấn đề ở đây nếu không sử dụng useMemo
    // const value = {user, isLoading, login, logout,setUser}
    // nó sẽ luôn tạo ra 1 obj mới {} !== {}
    // lúc này React sẽ nghĩ là cái obj này đã thay đổi rồi
    // ở dưới return về 1 component rồi truyền value vào : điều đó khiến cho mọi component dùng context sẽ re-render lại hết

    // useMemo giải quyết vấn đề như này
    // cú pháp của nó sẽ là useMemo(() => ({...}),deps)
    //nếu như deps không đổi thì dùng lại obj cũ
    // react sẽ thấy value === value (cùng tham chiếu) k, re-render lan xuống dưới
    // vì vậy deps ở đây sẽ hiểu là nếu như những thằng deps thay đổi, thì nó mới tạo ra 1 obj mới

    //vậy nên bản chất của việc sử dụng useMemo
    // nó không phải là để tránh render mà là để giữ cho giá trị không đổi reference nếu dữ liệu không đổi
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}