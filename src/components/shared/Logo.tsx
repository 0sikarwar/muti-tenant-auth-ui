
'use client';

import Image from 'next/image';
import { useTenant } from '@/hooks/useTenant';
import { Skeleton } from '@/components/ui/skeleton';

export function Logo({ className }: { className?: string }) {
  const { tenant, loading } = useTenant();

  if (loading || !tenant) {
    return <Skeleton className="h-10 w-32" />;
  }

  return (
    <div className={`relative h-10 w-32 ${className}`}>
      {tenant.logoUrl ? (
        <Image
          src={tenant.logoUrl}
          alt={`${tenant.name} Logo`}
          fill
          sizes="128px"
          style={{ objectFit: 'contain' }}
          priority
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xl font-bold text-foreground">
          {tenant.name}
        </div>
      )}
    </div>
  );
}
