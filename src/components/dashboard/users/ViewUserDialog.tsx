
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/lib/types';

interface ViewUserDialogProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewUserDialog({ user, isOpen, onOpenChange }: ViewUserDialogProps) {
  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Viewing information for {user.name}.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    {user.profile_image_url && <AvatarImage src={user.profile_image_url} alt={user.name} />}
                    <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                    <p>{user.role}</p>
                </div>
                 <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>{user.status}</Badge>
                </div>
                 <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Tenant ID</h3>
                    <p>{user.tenantId}</p>
                </div>
                 <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                    <p>{user.phone || 'N/A'}</p>
                </div>
                 <div className="col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                    <p>{user.address || 'N/A'}</p>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
