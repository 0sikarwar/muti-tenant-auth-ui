
'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/dashboard/users/data-table';
import { columns } from '@/components/dashboard/tenants/columns';
import { useEffect, useState } from 'react';
import type { Tenant } from '@/lib/types';
import * as api from '@/lib/api';


export default function TenantManagementPage() {
    const [tenants, setTenants] = useState<Tenant[]>([]);

    useEffect(() => {
        api.getTenants().then(setTenants).catch(console.error);
    }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Tenant Management</h1>
          <p className="text-muted-foreground">
            View, add, edit, and manage tenants.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Tenant
        </Button>
      </div>
      <DataTable columns={columns} data={tenants} />
    </div>
  );
}
