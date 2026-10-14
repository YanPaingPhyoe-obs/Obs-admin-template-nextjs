"use client"

import { useSearchParams } from "next/navigation"
import { AppHeader } from "@/layout/AppHeader"
import { useGetAdminLogs } from "../hooks/useAdminLogs"
import { AdminLogTable } from "../components/AdminLogTable"
import { DataPagination } from "@/components/DataPagination"

const AdminLogList = () => {
  const searchParams = useSearchParams()

  const page = searchParams?.get("page") ?? "1"
  const limit = searchParams?.get("limit") ?? "10"

  const { data, isLoading } = useGetAdminLogs({ page, limit })

  const total = data?.meta?.total ?? 0
  const offset = (Number(page) - 1) * Number(limit)

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Admin Logs"
        total={total}
        action={{ type: "none" }}
      />

      <div className="m-4 flex flex-col gap-0 rounded-lg bg-white">
        <AdminLogTable
          data={data?.data ?? []}
          isLoading={isLoading}
          offset={offset}
        />
        {data?.meta && <DataPagination meta={data.meta} />}
      </div>
    </div>
  )
}

export default AdminLogList
