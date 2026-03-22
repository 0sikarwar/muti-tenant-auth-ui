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
import { roleSchema } from "@/lib/validation";
import type { RoleDefinition } from "@/lib/types";
import * as api from "@/lib/api";
import { useEffect, useState } from "react";

interface EditRoleDialogProps {
  role: RoleDefinition | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleUpdated: () => void;
}

export function EditRoleDialog({ role, isOpen, onOpenChange, onRoleUpdated }: EditRoleDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!role;

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [role, form]);

  async function onSubmit(values: z.infer<typeof roleSchema>) {
    setIsLoading(true);
    try {
      if (isEditMode && role) {
        await api.updateRole(role.id, values);
        toast({ title: "Role Updated", description: "The role has been updated successfully." });
      } else {
        await api.createRole(values);
        toast({ title: "Role Created", description: "The new role has been added." });
      }
      onRoleUpdated();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: isEditMode ? "Update Failed" : "Creation Failed",
        description: `Could not ${isEditMode ? "update" : "create"} role.`,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Role" : "Add New Role"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the role name." : "Enter the name for the new role."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} placeholder="e.g. Editor" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
