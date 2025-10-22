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
    if (refreshToken) {
      headers["x-refresh-token"] = refreshToken;
    }
    if (storedToken) {
      headers["Authorization"] = storedToken;
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

  return response.json();
}

export const getTenants = (): Promise<Tenant[]> => fetchFromAPI("/tenants");
export const getTenantById = (id: string): Promise<Tenant> => fetchFromAPI(`/tenants/${id}`);
export const createTenant = (name: string, token: string): Promise<Tenant> =>
  fetchFromAPI("/tenants", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

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

export const updateProfile = (data: Partial<User>, token: string): Promise<User> =>
  fetchFromAPI("/auth/update-profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const logout = (token: string, refreshToken: string) =>
  fetchFromAPI("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

export const getUsers = (tenantId: string, token: string): Promise<User[]> =>
  fetchFromAPI(`/users?tenant_id=${tenantId}`);

export const getUserById = (id: string, token: string): Promise<User> => fetchFromAPI(`/users/${id}`);
