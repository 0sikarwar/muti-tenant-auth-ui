'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserMenu } from './UserMenu';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex w-full items-center justify-end">
        <UserMenu />
      </div>
    </header>
  );
}
