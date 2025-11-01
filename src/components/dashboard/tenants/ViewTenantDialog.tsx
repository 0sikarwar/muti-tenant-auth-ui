
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Tenant } from '@/lib/types';
import { Building } from 'lucide-react';

interface ViewTenantDialogProps {
  tenant: Tenant;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewTenantDialog({ tenant, isOpen, onOpenChange }: ViewTenantDialogProps) {
  const tenantInitials = tenant.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tenant Details</DialogTitle>
          <DialogDescription>Viewing information for {tenant.name}.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {tenant.logoUrl ? (
                <AvatarImage src={tenant.logoUrl} alt={tenant.name} />
              ) : (
                <AvatarFallback className="text-2xl">
                    <Building className="h-8 w-8" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{tenant.name}</h2>
              <p className="text-sm text-muted-foreground">ID: {tenant.id}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <p>{tenant.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
