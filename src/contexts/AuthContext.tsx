'use client';

import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import type { User, Role } from '@/lib/types';
import { users } from '@/lib/users';
import { useRouter } from 'next/navigation';
import { tenants } from '@/lib/tenants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, tenantId: string) => boolean;
  logout: () => void;
  register: (name: string, email: string) => boolean;
  hasPermission: (requiredRole: Role) => boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const USER_STORAGE_KEY = 'tenantverse-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  const login = (email: string, tenantId: string): boolean => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser && (foundUser.role === 'Super Admin' || foundUser.tenantId === tenantId)) {
      setUser(foundUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    router.push('/login');
  };

  const register = (name: string, email: string): boolean => {
    const defaultTenant = tenants[0];
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'User',
      tenantId: defaultTenant.id,
      avatar: `avatar-${(users.length % 6) + 1}`,
      status: 'active',
    };
    users.push(newUser); // Mock: add to in-memory user list
    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    return true;
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
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register, hasPermission, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
