import { createContext } from "react";

export type User = {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
};

export type AuthState = {
    user : User | null
    isLoading: boolean
    login: (token:string,user:User) => void
    logout: () => void
}

export const AuthContext = createContext<AuthState | null>(null)

