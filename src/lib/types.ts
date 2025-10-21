
export type Role = 'Super Admin' | 'Admin' | 'User';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId: string;
  avatar?: string;
  phone?: string;
  address?: string;
  status: 'active' | 'inactive';
  profile_image_url?: string;
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    background: string;
    accent: string;
  };
  fonts: {
    headline: string;
    body: string;
  };
}

export interface Tenant {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  theme: Theme;
}
