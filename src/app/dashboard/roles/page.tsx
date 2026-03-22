"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Shield, Key, Edit, Trash2, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import * as api from "@/lib/api";
import type { RoleDefinition, Permission } from "@/lib/types";
import { ConfirmationDialog } from "@/components/dashboard/ConfirmationDialog";
import { EditRoleDialog } from "@/components/dashboard/roles/EditRoleDialog";
import { EditPermissionDialog } from "@/components/dashboard/roles/EditPermissionDialog";
import { RolePermissionManager } from "@/components/dashboard/roles/RolePermissionManager";

export default function RolesPage() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [isRoleDialogOpen, setRoleDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [isRolePermissionManagerOpen, setRolePermissionManagerOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"role" | "permission" | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [rolesData, permissionsData] = await Promise.all([api.getRoles(), api.getPermissions()]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      console.error("Failed to fetch roles or permissions", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load roles and permissions.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRole = () => {
    setSelectedRole(null);
    setRoleDialogOpen(true);
  };

  const handleEditRole = (role: RoleDefinition) => {
    setSelectedRole(role);
    setRoleDialogOpen(true);
  };

  const handleManagePermissions = (role: RoleDefinition) => {
    setSelectedRole(role);
    setRolePermissionManagerOpen(true);
  };

  const handleAddPermission = () => {
    setSelectedPermission(null);
    setPermissionDialogOpen(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setPermissionDialogOpen(true);
  };

  const handleDeleteRequest = (type: "role" | "permission", item: RoleDefinition | Permission) => {
    setDeleteType(type);
    if (type === "role") setSelectedRole(item as RoleDefinition);
    else setSelectedPermission(item as Permission);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteType === "role" && selectedRole) {
        await api.deleteRole(selectedRole.id);
        toast({ title: "Role Deleted" });
      } else if (deleteType === "permission" && selectedPermission) {
        await api.deletePermission(selectedPermission.id);
        toast({ title: "Permission Deleted" });
      }
      fetchData();
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "An error occurred during deletion.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Roles & Permissions</h1>
        <p className="text-muted-foreground">Manage system roles and their associated permissions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Roles Section */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Roles
              </CardTitle>
              <CardDescription>System roles that can be assigned to users.</CardDescription>
            </div>
            <Button size="sm" onClick={handleAddRole}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4 mt-2">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading roles...</div>
              ) : roles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground italic">No roles defined.</div>
              ) : (
                roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-4 rounded-lg border transition-all hover:border-primary/50"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{role.name}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(!role.permissionIds || role.permissionIds.length === 0) ? (
                          <span className="text-xs text-muted-foreground italic">No permissions</span>
                        ) : (
                          role.permissionIds.map((pId) => {
                            const p = permissions.find((perm) => perm.id === pId);
                            return p ? (
                              <Badge key={pId} variant="secondary" className="text-[10px] px-1 py-0 h-4">
                                {p.name}
                              </Badge>
                            ) : null;
                          })
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleManagePermissions(role)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditRole(role)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRequest("role", role)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Permissions Section */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Key className="mr-2 h-5 w-5 text-primary" />
                Permissions
              </CardTitle>
              <CardDescription>Individual access control units.</CardDescription>
            </div>
            <Button size="sm" onClick={handleAddPermission}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Permission
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4 mt-2">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading permissions...</div>
              ) : permissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground italic">No permissions defined.</div>
              ) : (
                permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-4 rounded-lg border transition-all hover:border-primary/50"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{permission.name}</span>
                      {permission.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{permission.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditPermission(permission)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRequest("permission", permission)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <EditRoleDialog
        role={selectedRole}
        isOpen={isRoleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        onRoleUpdated={fetchData}
      />

      <EditPermissionDialog
        permission={selectedPermission}
        isOpen={isPermissionDialogOpen}
        onOpenChange={setPermissionDialogOpen}
        onPermissionUpdated={fetchData}
      />

      <RolePermissionManager
        role={selectedRole}
        isOpen={isRolePermissionManagerOpen}
        onOpenChange={setRolePermissionManagerOpen}
        permissions={permissions}
        onPermissionsUpdated={fetchData}
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title={`Delete ${deleteType === "role" ? "Role" : "Permission"}?`}
        description={`Are you sure you want to delete this ${deleteType}? This action cannot be undone.`}
      />
    </div>
  );
}
