import { REFRESH_TOKEN_STORAGE_KEY, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "@/contexts/AuthContext";
import type { Tenant, User } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchFromAPI(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

    if (storedToken) {
      headers["Authorization"] = `Bearer ${storedToken}`;
    }
    if (refreshToken) {
      headers["x-refresh-token"] = refreshToken;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      try {
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      } catch (e) {
        // ignore
      }
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
      throw new Error("Unauthorized");
    }

    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || "An API error occurred");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Tenant API
export const getTenants = (): Promise<Tenant[]> => fetchFromAPI("/tenants");
export const getTenantById = (id: string): Promise<Tenant> => fetchFromAPI(`/tenants/${id}`);
export const createTenant = (data: Partial<Tenant>): Promise<Tenant> =>
  fetchFromAPI("/tenants", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateTenant = (id: string, data: Partial<Tenant>): Promise<Tenant> =>
  fetchFromAPI(`/tenants/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteTenant = (id: string): Promise<void> =>
  fetchFromAPI(`/tenants/${id}`, {
    method: "DELETE",
  });

// Auth API
export const login = (email: string, password: string) =>
  fetchFromAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (name: string, email: string, password: string) =>
  fetchFromAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role: "user" }),
  });

export const forgotPassword = (email: string) =>
  fetchFromAPI("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const resetPassword = (token: string, password: string) =>
  fetchFromAPI("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });

export const updateProfile = (data: Partial<User>): Promise<User> =>
  fetchFromAPI("/auth/update-profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const logout = () =>
  fetchFromAPI("/auth/logout", {
    method: "POST",
  });

// User API
export const getUsers = (): Promise<User[]> => fetchFromAPI(`/users`);
export const getUserById = (id: string): Promise<User> => fetchFromAPI(`/users/${id}`);
export const updateUser = (id: string, data: Partial<User>): Promise<User> =>
  fetchFromAPI(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteUser = (id: string): Promise<void> =>
  fetchFromAPI(`/users/${id}`, {
    method: "DELETE",
  });
