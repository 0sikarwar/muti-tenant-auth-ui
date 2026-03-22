"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { permissionSchema } from "@/lib/validation";
import type { Permission } from "@/lib/types";
import * as api from "@/lib/api";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface EditPermissionDialogProps {
  permission: Permission | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPermissionUpdated: () => void;
}

export function EditPermissionDialog({
  permission,
  isOpen,
  onOpenChange,
  onPermissionUpdated,
}: EditPermissionDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!permission;

  const form = useForm<z.infer<typeof permissionSchema>>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (permission) {
      form.reset({
        name: permission.name,
        description: permission.description || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [permission, form]);

  async function onSubmit(values: z.infer<typeof permissionSchema>) {
    setIsLoading(true);
    try {
      if (isEditMode && permission) {
        await api.updatePermission(permission.id, values);
        toast({ title: "Permission Updated", description: "The permission has been updated successfully." });
      } else {
        await api.createPermission(values);
        toast({ title: "Permission Created", description: "The new permission has been added." });
      }
      onPermissionUpdated();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: isEditMode ? "Update Failed" : "Creation Failed",
        description: `Could not ${isEditMode ? "update" : "create"} permission.`,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Permission" : "Add New Permission"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the permission details." : "Enter the details for the new permission."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permission Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} placeholder="e.g. users:write" />
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
                    <Textarea
                      {...field}
                      disabled={isLoading}
                      placeholder="e.g. Allows creating and editing users"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Permission"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
