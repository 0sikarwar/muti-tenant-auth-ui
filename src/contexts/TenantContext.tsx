
'use client';

import type { ReactNode } from 'react';
import { createContext, useEffect, useState, useCallback } from 'react';
import type { Tenant, Theme } from '@/lib/types';
import * as api from '@/lib/api';

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
  const [tenants, setTenants] = useState<Tenant[]>([]);
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
    const fetchTenants = async () => {
      try {
        const fetchedTenants = await api.getTenants();
        setTenants(fetchedTenants);
        
        const storedTenantId = localStorage.getItem(TENANT_STORAGE_KEY);
        const initialTenant = fetchedTenants.find(t => t.id === storedTenantId) || fetchedTenants[0];
        
        if (initialTenant) {
          setTenant(initialTenant);
          applyTenantTheme(initialTenant.theme);
        }
      } catch (error) {
        console.error("Failed to fetch tenants", error);
      }
      setLoading(false);
    };

    fetchTenants();
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
