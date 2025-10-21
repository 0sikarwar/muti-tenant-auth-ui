"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Building, LayoutDashboard, UserCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/shared/Logo";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, requiredRole: "user" },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle, requiredRole: "user" },
  { href: "/dashboard/users", label: "User Management", icon: Users, requiredRole: "manager" },
  { href: "/dashboard/tenants", label: "Tenant Management", icon: Building, requiredRole: "admin" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { hasPermission } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) =>
            hasPermission(item.requiredRole) ? (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton isActive={pathname === item.href} tooltip={{ children: item.label }}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ) : null
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
