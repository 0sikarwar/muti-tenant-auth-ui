import type { Tenant, User } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const REFRESH_TOKEN_STORAGE_KEY = "refresh-auth-token";

async function fetchFromAPI(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (typeof window !== "undefined") {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    if (refreshToken) {
      headers["x-refresh-token"] = refreshToken;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
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
    headers: { Authorization: `Bearer ${token}` },
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
    body: JSON.stringify({ name, email, password, role: "user" }), // Defaulting role to 'User'
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
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

export const logout = (token: string, refreshToken: string) =>
  fetchFromAPI("/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ refreshToken }),
  });

// User APIs
export const getUsers = (tenantId: string, token: string): Promise<User[]> =>
  fetchFromAPI(`/users?tenant_id=${tenantId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUserById = (id: string, token: string): Promise<User> =>
  fetchFromAPI(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
