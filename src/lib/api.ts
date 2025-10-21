
import type { Tenant, User, Role } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchFromAPI(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An API error occurred');
  }

  return response.json();
}

// Tenant APIs
export const getTenants = (): Promise<Tenant[]> => fetchFromAPI('/tenants');
export const getTenantById = (id: string): Promise<Tenant> => fetchFromAPI(`/tenants/${id}`);

// Auth APIs
export const login = (email: string, tenantId: string) => fetchFromAPI('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, tenant_id: tenantId }),
});

export const register = (name: string, email: string, password: string, tenantId: string) => fetchFromAPI('/auth/register', {
  method: 'POST',
  body: JSON.stringify({ name, email, password, tenant_id: tenantId }),
});

export const forgotPassword = (email: string, tenantId: string) => fetchFromAPI('/auth/forgot-password', {
  method: 'POST',
  body: JSON.stringify({ email, tenant_id: tenantId }),
});

export const resetPassword = (token: string, password: string) => fetchFromAPI('/auth/reset-password', {
  method: 'POST',
  body: JSON.stringify({ token, password }),
});

// User APIs
export const getUsers = (tenantId: string): Promise<User[]> => fetchFromAPI(`/users?tenant_id=${tenantId}`);
export const getUserById = (id: string): Promise<User> => fetchFromAPI(`/users/${id}`);

export const updateUser = (id: string, data: Partial<User>): Promise<User> => fetchFromAPI(`/users/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});

export const createUser = (data: Omit<User, 'id' | 'status' | 'avatar'>): Promise<User> => fetchFromAPI('/users', {
    method: 'POST',
    body: JSON.stringify(data),
});
