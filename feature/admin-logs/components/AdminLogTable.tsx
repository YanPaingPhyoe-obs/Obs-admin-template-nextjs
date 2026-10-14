"use client"

import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "date-fns"
import { DataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"
import type { AdminLog } from "../types"

type AdminLogTableProps = {
  data: AdminLog[]
  isLoading?: boolean
  offset?: number
}

export function AdminLogTable({ data, isLoading, offset = 0 }: AdminLogTableProps) {
  const columns = useMemo<ColumnDef<AdminLog>[]>(
    () => [
      {
        id: "no",
        header: "No.",
        cell: ({ row }) => offset + row.index + 1,
      },
      {
        id: "createdAt",
        header: "Date",
        cell: ({ row }) => {
          const dateStr = row.original.createdAt
          if (!dateStr) return "-"
          return formatDate(dateStr, "dd-MM-yyyy HH:mm")
        },
      },
      {
        id: "admin",
        header: "Admin",
        cell: ({ row }) => {
          const admin = row.original.admin
          if (!admin) return "-"
          return (
            <div className="flex flex-col">
              <span className="font-medium">{admin.fullName}</span>
              <span className="text-xs text-muted-foreground">{admin.email}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.action}</Badge>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        id: "device",
        header: "Device / Browser",
        cell: ({ row }) => {
          const { device, browser, os } = row.original
          if (!device && !browser) return "-"
          return (
            <div className="flex flex-col">
              <span className="text-sm">{browser || "-"}</span>
              <span className="text-xs text-muted-foreground">
                {[device, os].filter(Boolean).join(" · ")}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: "ipAddress",
        header: "IP Address",
        cell: ({ row }) => row.original.ipAddress || "-",
      },
    ],
    [offset]
  )

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No admin logs found."
    />
  )
}
