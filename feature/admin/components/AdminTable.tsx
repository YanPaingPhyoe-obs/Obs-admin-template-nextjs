"use client"

import { useState, useMemo } from "react"
import { MoreHorizontal } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { AdminDetailDialog } from "./AdminDetailDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { AdminFormDialog } from "./AdminFormDialog"
import { useDeleteAdmin } from "../hooks/useAdmins"
import type { Admin } from "../types"
import { formatDate } from "date-fns"
import { DataTable } from "@/components/DataTable"

const statusConfig: Record<string, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "border border-green-500 text-green-600 bg-green-50",
  },
  suspended: {
    label: "Suspend",
    className: "border border-yellow-500 text-yellow-600 bg-yellow-50",
  },
  inactive: {
    label: "Inactive",
    className: "border border-red-400 text-red-500 bg-red-50",
  },
}

function StatusBadge({ admin }: { admin: Admin }) {
  const statusKey = admin.status ?? (admin.isBanned ? "suspended" : "active")
  const config = statusConfig[statusKey] ?? statusConfig.active

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  )
}

type AdminTableProps = {
  data: Admin[]
  isLoading?: boolean
  offset?: number
}

export function AdminTable({ data, isLoading, offset = 0 }: AdminTableProps) {
  const [viewAdmin, setViewAdmin] = useState<Admin | undefined>(undefined)
  const [editAdmin, setEditAdmin] = useState<Admin | undefined>(undefined)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin()

  const handleConfirmDelete = () => {
    if (!deleteId) return
    deleteAdmin(deleteId, { onSuccess: () => setDeleteId(null) })
  }

  const columns = useMemo<ColumnDef<Admin>[]>(
    () => [
      {
        id: "no",
        header: "No.",
        cell: ({ row }) => offset + row.index + 1,
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
          const createdAt = row.original.createdAt
          return formatDate(new Date(createdAt), "dd MMM yyyy")
        },
      },
      {
        accessorKey: "fullName",
        header: "Username",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        id: "role",
        header: "Role",
        cell: ({ row }) => row.original.role?.name ?? "—",
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge admin={row.original} />,
      },
      {
        id: "actions",
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => {
          const admin = row.original
          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewAdmin(admin)}>
                    View Detail
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditAdmin(admin)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteId(admin.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    [offset]
  )

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No admins found."
      />

      <AdminDetailDialog
        open={!!viewAdmin}
        onOpenChange={(open) => {
          if (!open) setViewAdmin(undefined)
        }}
        admin={viewAdmin}
      />

      <AdminFormDialog
        open={!!editAdmin}
        onOpenChange={(open) => {
          if (!open) setEditAdmin(undefined)
        }}
        admin={editAdmin}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Admin"
        description="Are you sure you want to delete this admin? This action cannot be undone."
        confirmLabel="Delete"
      />
    </>
  )
}
