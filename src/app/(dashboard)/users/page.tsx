
'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { UserTable } from '@/components/dashboard/users/UserTable';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';
import * as api from '@/lib/api';

export default function UserManagementPage() {
  const { user, token, hasPermission } = useAuth();
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    if (user?.tenantId && token) {
      api.getUsers(user.tenantId, token).then(setAllUsers).catch(console.error);
    }
  }, [user?.tenantId, token]);
  
  const visibleUsers = useMemo(() => {
    if (!user) return [];
    if (hasPermission('Super Admin')) {
        return allUsers;
    }
    if (hasPermission('Admin')) {
        return allUsers.filter((u: User) => u.tenantId === user.tenantId);
    }
    return [];
  }, [user, hasPermission, allUsers]);


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">User Management</h1>
          <p className="text-muted-foreground">
            View, add, edit, and manage users.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <UserTable data={visibleUsers} />
    </div>
  );
}
