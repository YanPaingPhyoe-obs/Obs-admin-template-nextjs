"use client"

import { useSearchParams } from "next/navigation"
import { AppHeader } from "@/layout/AppHeader"
import { useGetAuditLogs } from "../hooks/useAuditLogs"
import { AuditLogTable } from "../components/AuditLogTable"
import { DataPagination } from "@/components/DataPagination"

const AuditLogList = () => {
  const searchParams = useSearchParams()
  const page = searchParams?.get("page") ?? "1"
  const limit = searchParams?.get("limit") ?? "10"

  const { data, isLoading } = useGetAuditLogs({
    page,
    limit,
  })

  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10)

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Audit Logs" action={{ type: "none" }} />

      <div className="m-4 flex-1 space-y-4">
        <div className="rounded-md bg-white p-4 shadow-sm">
          <AuditLogTable
            data={data?.data ?? []}
            isLoading={isLoading}
            offset={offset}
          />

          {data?.meta && (
            <div className="mt-4">
              <DataPagination meta={data.meta} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuditLogList
