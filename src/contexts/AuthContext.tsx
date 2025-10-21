
'use client';

import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import type { User, Role } from '@/lib/types';
import { useRouter } from 'next/navigation';
import * as api from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, tenantId: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, tenantId: string) => Promise<boolean>;
  hasPermission: (requiredRole: Role) => boolean;
  loading: boolean;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const USER_STORAGE_KEY = 'tenantverse-user';
const TOKEN_STORAGE_KEY = 'tenantverse-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, tenantId: string): Promise<boolean> => {
    try {
      const { user: loggedInUser, token: authToken } = await api.login(email, tenantId);
      if (loggedInUser && authToken) {
        setUser(loggedInUser);
        setToken(authToken);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
        localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    router.push('/login');
  };

  const register = async (name: string, email: string, password: string, tenantId: string): Promise<boolean> => {
    try {
        const { user: newUser, token: authToken } = await api.register(name, email, password, tenantId);
        if (newUser && authToken) {
            setUser(newUser);
            setToken(authToken);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
            localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Registration failed', error);
        return false;
    }
  };
  
  const hasPermission = (requiredRole: Role): boolean => {
    if (!user) return false;
    const roleHierarchy: { [key in Role]: number } = {
      'User': 1,
      'Admin': 2,
      'Super Admin': 3,
    };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register, hasPermission, loading, token }}>
      {children}
    </AuthContext.Provider>
  );
}
