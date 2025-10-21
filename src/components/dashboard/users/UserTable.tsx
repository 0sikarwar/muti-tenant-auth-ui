'use client';

import { columns } from './columns';
import { DataTable } from './data-table';
import type { User } from '@/lib/types';

interface UserTableProps {
    data: User[];
}

export function UserTable({ data }: UserTableProps) {
  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
