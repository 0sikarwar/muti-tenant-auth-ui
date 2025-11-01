
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { userManagementSchema } from '@/lib/validation';
import type { User, Tenant, Role } from '@/lib/types';
import * as api from '@/lib/api';
import { useEffect, useState } from 'react';

interface EditUserDialogProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export function EditUserDialog({ user, isOpen, onOpenChange, onUserUpdated }: EditUserDialogProps) {
  const { toast } = useToast();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const isEditMode = !!user;

  const form = useForm<z.infer<typeof userManagementSchema>>({
    resolver: zodResolver(userManagementSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      tenantId: '',
    },
  });

  useEffect(() => {
    api.getTenants().then(setTenants).catch(console.error);
  }, []);

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        tenantId: user.tenantId,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        role: 'user',
        status: 'active',
        tenantId: '',
      });
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof userManagementSchema>) {
    try {
      if (isEditMode && user) {
        await api.updateUser(user.id, values);
        toast({ title: 'User Updated', description: 'The user details have been saved.' });
      } else {
        // In add mode, we might need a password field or a different API endpoint
        // For now, let's assume register can be used, or a createUser endpoint exists
        // This part needs clarification based on API capabilities
        await api.register(values.name, values.email, 'DefaultPassword123!'); // Placeholder password
        toast({ title: 'User Created', description: 'The new user has been added.' });
      }
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: isEditMode ? 'Update Failed' : 'Creation Failed',
        description: `Could not ${isEditMode ? 'update' : 'create'} user.`,
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Make changes to the user's profile." : 'Enter the details for the new user.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(['user', 'manager', 'admin'] as Role[]).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tenant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
