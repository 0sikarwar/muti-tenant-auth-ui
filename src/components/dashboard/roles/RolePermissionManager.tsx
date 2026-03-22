"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { RoleDefinition, Permission } from "@/lib/types";
import * as api from "@/lib/api";

interface RolePermissionManagerProps {
  role: RoleDefinition | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  permissions: Permission[];
  onPermissionsUpdated: () => void;
}
import { Button } from "@/components/ui/button";

export function RolePermissionManager({
  role,
  isOpen,
  onOpenChange,
  permissions,
  onPermissionsUpdated,
}: RolePermissionManagerProps) {
  const { toast } = useToast();
  const [currentPermissionIds, setCurrentPermissionIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (role && isOpen) {
      setCurrentPermissionIds(role.permissionIds || []);
    }
  }, [role, isOpen]);

  const handleTogglePermission = (permissionId: string, checked: boolean) => {
    if (checked) {
      setCurrentPermissionIds((prev) => [...prev, permissionId]);
    } else {
      setCurrentPermissionIds((prev) => prev.filter((id) => id !== permissionId));
    }
  };

  const handleSave = async () => {
    if (!role) return;
    setIsSaving(true);
    try {
      const initialIds = role.permissionIds || [];
      const toAdd = currentPermissionIds.filter((id) => !initialIds.includes(id));
      const toRemove = initialIds.filter((id) => !currentPermissionIds.includes(id));

      // Process additions
      await Promise.all(toAdd.map((id) => api.assignPermissionToRole(role.id, id)));

      // Process removals
      await Promise.all(toRemove.map((id) => api.removePermissionFromRole(role.id, id)));

      toast({
        title: "Permissions Updated",
        description: `Successfully updated permissions for ${role.name}.`,
      });
      onPermissionsUpdated();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "An error occurred while saving permission changes.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Permissions for {role?.name}</DialogTitle>
          <DialogDescription>Assign or remove permissions for this role.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4 py-2">
            {permissions.length === 0 && (
              <p className="text-center text-sm text-muted-foreground italic">No permissions available.</p>
            )}
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className="flex items-start space-x-3 rounded-md border p-4 transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  id={`perm-${permission.id}`}
                  checked={currentPermissionIds.includes(permission.id)}
                  disabled={isSaving}
                  onCheckedChange={(checked) => handleTogglePermission(permission.id, !!checked)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={`perm-${permission.id}`} className="text-sm font-medium leading-none cursor-pointer">
                    {permission.name}
                  </Label>
                  {permission.description && <p className="text-xs text-muted-foreground">{permission.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
