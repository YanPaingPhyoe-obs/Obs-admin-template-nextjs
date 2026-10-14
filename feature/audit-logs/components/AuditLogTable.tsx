"use client"

import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "date-fns"
import { DataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"
import type { AuditLog } from "../types"

type AuditLogTableProps = {
  data: AuditLog[]
  isLoading?: boolean
  offset?: number
}

export function AuditLogTable({ data, isLoading, offset = 0 }: AuditLogTableProps) {
  const columns = useMemo<ColumnDef<AuditLog>[]>(
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
          return formatDate(new Date(dateStr), "dd-MM-yyyy HH:mm")
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
        accessorKey: "resourceType",
        header: "Resource",
        cell: ({ row }) => {
          const resource = row.original.resourceType
          return resource ? (
            <span className="capitalize">{resource}</span>
          ) : (
            "-"
          )
        },
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.original.action}
          </Badge>
        ),
      },
      {
        id: "requestInfo",
        header: "Request Info",
        cell: ({ row }) => {
          const metadata = row.original.metadata
          if (!metadata?.method && !metadata?.url) return "-"
          return (
            <div className="flex flex-col gap-1 max-w-[200px]">
              {metadata.method && (
                <Badge variant="secondary" className="w-fit text-[10px] px-1 py-0 uppercase">
                  {metadata.method}
                </Badge>
              )}
              {metadata.url && (
                <span className="text-xs text-muted-foreground truncate" title={metadata.url}>
                  {metadata.url}
                </span>
              )}
            </div>
          )
        },
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
        cell: ({ row }) => {
          const ip = row.original.ipAddress
          if (!ip) return "-"
          return <span className="text-xs">{ip.split(",")[0].trim()}</span>
        },
      },
    ],
    [offset]
  )

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No audit logs found."
    />
  )
}
