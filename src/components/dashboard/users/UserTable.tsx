
'use client';

import { generateColumns } from './columns';
import { DataTable } from './data-table';
import type { User } from '@/lib/types';

interface UserTableProps {
    data: User[];
    onEdit: (user: User) => void;
    onView: (user: User) => void;
    onDelete: (user: User) => void;
}

export function UserTable({ data, onEdit, onView, onDelete }: UserTableProps) {
  const columns = generateColumns({ onEdit, onView, onDelete });
  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
