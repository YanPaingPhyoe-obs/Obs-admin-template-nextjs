"use client"

import { useState, useMemo } from "react"
import { Pencil, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { CategoryFormDialog } from "./CategoryFormDialog"
import { useDeleteCategory } from "../hooks/useCategories"
import type { Category } from "../types"
import { DataTable } from "@/components/DataTable"

type CategoryTableProps = {
  data: Category[]
  isLoading?: boolean
  offset?: number
}

export function CategoryTable({
  data,
  isLoading,
  offset = 0,
}: CategoryTableProps) {
  const [editCategory, setEditCategory] = useState<Category | undefined>(
    undefined
  )
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory()

  const handleConfirmDelete = () => {
    if (!deleteId) return
    deleteCategory(deleteId, { onSuccess: () => setDeleteId(null) })
  }

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        id: "no",
        header: "No.",
        cell: ({ row }) => offset + row.index + 1,
      },
      {
        accessorKey: "name",
        header: "Category",
      },
      {
        id: "actions",
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => {
          const category = row.original
          return (
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setEditCategory(category)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setDeleteId(category.id)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
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
        emptyMessage="No categories found."
      />

      <CategoryFormDialog
        open={!!editCategory}
        onOpenChange={(open) => {
          if (!open) setEditCategory(undefined)
        }}
        category={editCategory}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
      />
    </>
  )
}
