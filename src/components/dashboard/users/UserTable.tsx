"use client";

import { generateColumns } from "./columns";
import { DataTable } from "./data-table";
import type { Tenant, User } from "@/lib/types";

interface UserTableProps {
  data: User[];
  tenants: Tenant[];
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({ data, onEdit, onView, onDelete, tenants }: UserTableProps) {
  const columns = generateColumns({ onEdit, onView, onDelete, tenants });
  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
