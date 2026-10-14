"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Plus } from "lucide-react"
import { AppHeader } from "@/layout/AppHeader"
import { DataPagination } from "@/components/DataPagination"
import { useGetRoles } from "../hooks/useRoles"
import { RoleTable } from "../components/RoleTable"
import { isAuthorized } from "@/feature/profile/hooks/useProfile"
import SearchBar from "@/components/SearchBar"

const RoleList = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = searchParams?.get("page") ?? "1"
  const limit = searchParams?.get("limit") ?? "10"

  const { data, isLoading } = useGetRoles({ page, limit })

  const total = data?.meta?.total ?? 0
  const offset = (Number(page) - 1) * Number(limit)

  return (
    <>
      {isAuthorized("ADMIN_LIST", "READ") && (
        <div className="flex flex-col">
          <AppHeader
            title="Role List"
            total={total}
            action={{
              type: "button",
              label: "Add New",
              icon: <Plus className="size-4" />,
              onClick: () => router.push("/roles/create"),
            }}
          />

          <div className="m-4 flex flex-col gap-0 rounded-lg bg-white">
            <SearchBar title="Search by role name" />
            <RoleTable
              data={data?.data ?? []}
              isLoading={isLoading}
              offset={offset}
            />
            {data?.meta && <DataPagination meta={data.meta} />}
          </div>
        </div>
      )}
    </>
  )
}

export default RoleList
