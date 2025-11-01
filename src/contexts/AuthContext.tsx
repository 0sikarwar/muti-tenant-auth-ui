"use client";

import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import type { User, Role } from "@/lib/types";
import { useRouter } from "next/navigation";
import * as api from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  hasPermission: (requiredRole: Role) => boolean;
  loading: boolean;
  token: string | null;
  refreshToken: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const USER_STORAGE_KEY = "user";
export const TOKEN_STORAGE_KEY = "auth-token";
export const REFRESH_TOKEN_STORAGE_KEY = "refresh-auth-token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
      if (storedUser && storedToken && storedRefreshToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const resp = await api.login(email, password);
      console.log("resp", resp);
      const { user: loggedInUser, accessToken, refreshToken: refToken } = resp;
      if (loggedInUser && accessToken) {
        setUser(loggedInUser);
        setToken(accessToken);
        setRefreshToken(refToken);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
        localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = async () => {
    if (refreshToken) {
      try {
        await api.logout();
      } catch (error) {
        console.error("Logout API call failed", error);
      }
    }
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    router.push("/login");
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { user: newUser, accessToken, refreshToken: refToken } = await api.register(name, email, password);
      if (newUser && accessToken) {
        setUser(newUser);
        setToken(accessToken);
        setRefreshToken(refToken);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
        localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration failed", error);
      return false;
    }
  };

  const hasPermission = (requiredRole: Role): boolean => {
    if (!user) return false;
    const roleHierarchy: { [key in Role]: number } = {
      user: 1,
      manager: 2,
      admin: 3,
    };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, register, hasPermission, loading, token, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}
