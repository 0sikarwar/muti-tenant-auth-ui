'use client';

import Image from 'next/image';
import { useTenant } from '@/hooks/useTenant';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';

export function Logo({ className }: { className?: string }) {
  const { tenant, loading } = useTenant();

  if (loading || !tenant) {
    return <Skeleton className="h-10 w-32" />;
  }

  const logoImage = PlaceHolderImages.find(img => img.id === tenant.logoUrlId);

  return (
    <div className={`relative h-10 w-32 ${className}`}>
      {logoImage ? (
        <Image
          src={logoImage.imageUrl}
          alt={`${tenant.name} Logo`}
          fill
          sizes="128px"
          style={{ objectFit: 'contain' }}
          data-ai-hint={logoImage.imageHint}
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
