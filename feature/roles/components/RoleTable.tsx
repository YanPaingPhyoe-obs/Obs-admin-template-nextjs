"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { DataTable } from "@/components/DataTable"
import { useDeleteRole } from "../hooks/useRoles"
import type { Role } from "../types"

type RoleTableProps = {
  data: Role[]
  isLoading?: boolean
  offset?: number
}

export function RoleTable({ data, isLoading, offset = 0 }: RoleTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole()

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    await deleteRole(deleteId)
    setDeleteId(null)
  }

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      {
        id: "no",
        header: "No.",
        cell: ({ row }) => offset + row.index + 1,
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => row.original.description ?? "—",
      },
      {
        id: "actions",
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => {
          const role = row.original
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
                  <DropdownMenuItem onClick={() => router.push(`/roles/${role.id}`)}>
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/roles/${role.id}/edit`)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteId(role.id)}
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
    [offset, router]
  )

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No roles found."
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone."
        confirmLabel="Delete"
      />
    </>
  )
}
