import type { UpdateUserInput, UserResponse } from "../types"
import { apiRequest } from "./client"

export const getCurrentUserApi = () => {
    return apiRequest<UserResponse>("/user")
}

export const loginApi = (email:string, password:string) => {
    return apiRequest<UserResponse>("/users/login", {
        method:"POST",
        body: JSON.stringify({user: {email,password}})
    })
}

export const registerApi = (username:string,email:string, password:string) => {
    return apiRequest<UserResponse>("/users", {
        method:"POST",
        body: JSON.stringify({user: {username,email,password}})
    })
}

export function parseApiError(err: unknown): string {
  const apiErr = err as { data: { errors: Record<string, string | string[]> } };
  return Object.entries(apiErr.data.errors)
    .map(([field, errs]) => {
      if (Array.isArray(errs)) {
        return `${field} ${errs.join(", ")}`;
      }
      return `${field} ${errs}`;
    })
    .join(". ");
}

export const updateUserApi = (data:UpdateUserInput) => 
    apiRequest<UserResponse>("/user", {
        method: "PUT",
        body:JSON.stringify({user:data})
    })