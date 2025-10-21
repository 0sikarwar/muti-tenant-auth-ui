'use client';

import type { ReactNode } from 'react';
import { createContext, useEffect, useState, useCallback } from 'react';
import type { Tenant, Theme } from '@/lib/types';
import { tenants } from '@/lib/tenants';

interface TenantContextType {
  tenant: Tenant | null;
  tenants: Tenant[];
  selectTenant: (tenantId: string) => void;
  loading: boolean;
  applyTenantTheme: (theme: Theme) => void;
}

export const TenantContext = createContext<TenantContextType | null>(null);

const TENANT_STORAGE_KEY = 'tenantverse-tenant';

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  const applyTenantTheme = useCallback((theme: Theme) => {
    const root = document.documentElement;
    if (!root) return;

    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Apply fonts
    const body = document.body;
    if (theme.fonts.body) {
      body.style.fontFamily = theme.fonts.body;
    }
    // You might need a more sophisticated way to apply headline fonts,
    // e.g., by adding a class or targeting specific elements.
    // For now, we update a CSS variable.
    root.style.setProperty('--font-headline', theme.fonts.headline);
  }, []);
  
  useEffect(() => {
    try {
      const storedTenantId = localStorage.getItem(TENANT_STORAGE_KEY);
      const initialTenant = tenants.find(t => t.id === storedTenantId) || tenants[0];
      setTenant(initialTenant);
      if (initialTenant) {
        applyTenantTheme(initialTenant.theme);
      }
    } catch (error) {
      console.error("Failed to initialize tenant from localStorage", error);
      setTenant(tenants[0]);
      if(tenants[0]) {
        applyTenantTheme(tenants[0].theme);
      }
    }
    setLoading(false);
  }, [applyTenantTheme]);

  const selectTenant = (tenantId: string) => {
    const newTenant = tenants.find(t => t.id === tenantId);
    if (newTenant) {
      setTenant(newTenant);
      localStorage.setItem(TENANT_STORAGE_KEY, newTenant.id);
      applyTenantTheme(newTenant.theme);
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, tenants, selectTenant, loading, applyTenantTheme }}>
      {children}
    </TenantContext.Provider>
  );
}
