
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { tenantManagementSchema } from '@/lib/validation';
import type { Tenant } from '@/lib/types';
import * as api from '@/lib/api';
import { useEffect } from 'react';

interface EditTenantDialogProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTenantUpdated: () => void;
}

export function EditTenantDialog({ tenant, isOpen, onOpenChange, onTenantUpdated }: EditTenantDialogProps) {
  const { toast } = useToast();
  const isEditMode = !!tenant;

  const form = useForm<z.infer<typeof tenantManagementSchema>>({
    resolver: zodResolver(tenantManagementSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (tenant) {
      form.reset({
        name: tenant.name,
        description: tenant.description,
      });
    } else {
      form.reset({
        name: '',
        description: '',
      });
    }
  }, [tenant, form]);

  async function onSubmit(values: z.infer<typeof tenantManagementSchema>) {
    try {
      if (isEditMode && tenant) {
        await api.updateTenant(tenant.id, values);
        toast({ title: 'Tenant Updated', description: 'The tenant details have been saved.' });
      } else {
        await api.createTenant(values);
        toast({ title: 'Tenant Created', description: 'The new tenant has been added.' });
      }
      onTenantUpdated();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: isEditMode ? 'Update Failed' : 'Creation Failed',
        description: `Could not ${isEditMode ? 'update' : 'create'} tenant.`,
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Make changes to the tenant's information." : 'Enter the details for the new tenant.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
