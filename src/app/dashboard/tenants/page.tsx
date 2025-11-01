
'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/dashboard/users/data-table';
import { generateColumns } from '@/components/dashboard/tenants/columns';
import { useEffect, useState } from 'react';
import type { Tenant } from '@/lib/types';
import * as api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationDialog } from '@/components/dashboard/ConfirmationDialog';
import { EditTenantDialog } from '@/components/dashboard/tenants/EditTenantDialog';
import { ViewTenantDialog } from '@/components/dashboard/tenants/ViewTenantDialog';

export default function TenantManagementPage() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const { toast } = useToast();
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [isViewOpen, setViewOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [isAddOpen, setAddOpen] = useState(false);

    const fetchTenants = () => {
        api.getTenants().then(setTenants).catch(console.error);
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const handleView = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setViewOpen(true);
    };

    const handleEdit = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setEditOpen(true);
    };

    const handleDelete = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedTenant) {
            try {
                await api.deleteTenant(selectedTenant.id);
                toast({ title: "Tenant Deleted", description: `Tenant ${selectedTenant.name} has been deleted.` });
                fetchTenants();
            } catch (error) {
                toast({ variant: "destructive", title: "Deletion Failed", description: "Could not delete tenant." });
            } finally {
                setDeleteOpen(false);
                setSelectedTenant(null);
            }
        }
    };
    
    const handleAddTenant = () => {
        setSelectedTenant(null);
        setAddOpen(true);
    }

    const columns = generateColumns({ onEdit: handleEdit, onView: handleView, onDelete: handleDelete });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Tenant Management</h1>
                    <p className="text-muted-foreground">
                        View, add, edit, and manage tenants.
                    </p>
                </div>
                <Button onClick={handleAddTenant}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Tenant
                </Button>
            </div>
            <DataTable columns={columns} data={tenants} />
            
            {selectedTenant && (
                <>
                    <ViewTenantDialog tenant={selectedTenant} isOpen={isViewOpen} onOpenChange={setViewOpen} />
                    <ConfirmationDialog
                        isOpen={isDeleteOpen}
                        onOpenChange={setDeleteOpen}
                        onConfirm={confirmDelete}
                        title="Are you sure you want to delete this tenant?"
                        description="This action cannot be undone. This will permanently delete the tenant and all associated data."
                    />
                </>
            )}

            <EditTenantDialog 
                tenant={selectedTenant} 
                isOpen={isAddOpen || isEditOpen} 
                onOpenChange={isAddOpen ? setAddOpen : setEditOpen} 
                onTenantUpdated={() => {
                    fetchTenants();
                    if (isAddOpen) setAddOpen(false);
                    if (isEditOpen) setEditOpen(false);
                }} 
            />
        </div>
    );
}
