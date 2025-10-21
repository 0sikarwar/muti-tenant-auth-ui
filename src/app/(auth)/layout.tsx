'use client';

import { Logo } from '@/components/shared/Logo';
import { useTenant } from '@/hooks/useTenant';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tenant, loading } = useTenant();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          {loading ? <Skeleton className="h-12 w-40" /> : <Logo />}
          <h1 className="mt-4 font-headline text-3xl font-bold tracking-tight text-foreground">
            {loading ? <Skeleton className="h-9 w-48" /> : tenant?.name}
          </h1>
          <p className="text-muted-foreground">Welcome to TenantVerse</p>
        </div>
        {children}
      </div>
    </main>
  );
}
