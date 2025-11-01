
"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { UserTable } from "@/components/dashboard/users/UserTable";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import * as api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/dashboard/ConfirmationDialog";
import { EditUserDialog } from "@/components/dashboard/users/EditUserDialog";
import { ViewUserDialog } from "@/components/dashboard/users/ViewUserDialog";

export default function UserManagementPage() {
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewOpen, setViewOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);

  const fetchUsers = () => {
    api.getUsers().then(setAllUsers).catch(console.error);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const visibleUsers = useMemo(() => {
    if (!user) return [];
    if (hasPermission("admin")) {
      return allUsers;
    }
    if (hasPermission("manager")) {
      return allUsers.filter((u: User) => u.tenantId === user.tenantId);
    }
    return [];
  }, [user, hasPermission, allUsers]);

  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await api.deleteUser(selectedUser.id);
        toast({ title: "User Deleted", description: `User ${selectedUser.name} has been deleted.` });
        fetchUsers();
      } catch (error) {
        toast({ variant: "destructive", title: "Deletion Failed", description: "Could not delete user." });
      } finally {
        setDeleteOpen(false);
        setSelectedUser(null);
      }
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setAddOpen(true);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">User Management</h1>
          <p className="text-muted-foreground">View, add, edit, and manage users.</p>
        </div>
        <Button onClick={handleAddUser}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <UserTable data={visibleUsers} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />

      {selectedUser && (
        <>
          <ViewUserDialog user={selectedUser} isOpen={isViewOpen} onOpenChange={setViewOpen} />
          <ConfirmationDialog
            isOpen={isDeleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={confirmDelete}
            title="Are you sure you want to delete this user?"
            description="This action cannot be undone. This will permanently delete the user's account and remove their data from our servers."
          />
        </>
      )}

      <EditUserDialog
        user={selectedUser}
        isOpen={isAddOpen || isEditOpen}
        onOpenChange={isAddOpen ? setAddOpen : setEditOpen}
        onUserUpdated={() => {
            fetchUsers();
            if(isAddOpen) setAddOpen(false);
            if(isEditOpen) setEditOpen(false);
        }}
        />

    </div>
  );
}
