import { createContext } from "react";
import type { User } from "../types";


export type AuthState = {
    user : User | null
    isLoading: boolean
    login: (token:string,user:User) => void
    logout: () => void
}

export const AuthContext = createContext<AuthState | null>(null)

