import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/dashboard/users/data-table';
import { tenants } from '@/lib/tenants';
import { columns } from '@/components/dashboard/tenants/columns';


export default function TenantManagementPage() {

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
