"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Plus } from "lucide-react"
import { AppHeader } from "@/layout/AppHeader"
import { useGetAdmins } from "../hooks/useAdmins"
import { AdminFilterSearch } from "../components/AdminFilterSearch"
import { AdminTable } from "../components/AdminTable"
import { AdminFormDialog } from "../components/AdminFormDialog"
import { DataPagination } from "@/components/DataPagination"

const AdminList = () => {
  const searchParams = useSearchParams()
  const [createOpen, setCreateOpen] = useState(false)

  const queryString = searchParams ? searchParams.toString() : ""
  const { data, isLoading } = useGetAdmins(queryString)

  const total = data?.meta?.total ?? 0
  const page = Number(searchParams?.get("page") || "1")
  const limit = Number(searchParams?.get("limit") || "10")
  const offset = (page - 1) * limit

  return (
    <div className="flex flex-col">
      <AppHeader
        title={`Admin List`}
        total={total}
        action={{
          type: "button",
          label: "Create",
          icon: <Plus className="size-4" />,
          onClick: () => setCreateOpen(true),
        }}
      />

      <div className="table-shadow m-4 flex flex-col gap-0 rounded-t-md rounded-b-md bg-white">
        <AdminFilterSearch />
        <div>
          <AdminTable
            data={data?.data ?? []}
            isLoading={isLoading}
            offset={offset}
          />
        </div>
        {data?.meta && <DataPagination meta={data.meta} />}
      </div>

      <AdminFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}

export default AdminList
