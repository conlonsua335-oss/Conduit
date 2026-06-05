import type { UpdateUserInput, UserResponse } from "../types"
import { apiRequest } from "./client"

export const getCurrentUserApi = () => {
  return apiRequest<UserResponse>("/user")
}

export const loginApi = (email: string, password: string) => {
  return apiRequest<UserResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify({ user: { email, password } })
  })
}

export const registerApi = (username: string, email: string, password: string) => {
  return apiRequest<UserResponse>("/users", {
    method: "POST",
    body: JSON.stringify({ user: { username, email, password } })
  })
}

export function parseApiError(err: unknown): string {
  try {
    const apiErr = err as {
      status: number;
      data: { errors: Record<string, string | string[]> }
    };

    if (apiErr.status === 401) return "You must be logged in to do this.";
    if (apiErr.status === 404) return "Resource not found.";
    if (apiErr.status === 422 && apiErr.data?.errors) {
      return Object.entries(apiErr.data.errors)
        .map(([field, errs]) => {
          if (Array.isArray(errs)) return `${field} ${errs.join(", ")}`;
          return `${field} ${errs}`;
        })
        .join(". ");
    }
    if (err instanceof TypeError) {
      return "Network error. Please check your connection.";
    }
    return "Something went wrong. Please try again.";
  } catch {
    return "Something went wrong. Please try again.";
  }
}

export const updateUserApi = (data: UpdateUserInput) =>
  apiRequest<UserResponse>("/user", {
    method: "PUT",
    body: JSON.stringify({ user: data })
  })