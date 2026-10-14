"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Plus } from "lucide-react"
import { AppHeader } from "@/layout/AppHeader"
import { useGetCategories } from "../hooks/useCategories"
import { CategoryTable } from "../components/CategoryTable"
import { CategoryFormDialog } from "../components/CategoryFormDialog"
import { DataPagination } from "@/components/DataPagination"
import SearchBar from "@/components/SearchBar"

const CategoryList = () => {
  const searchParams = useSearchParams()
  const [createOpen, setCreateOpen] = useState(false)
  const search = searchParams?.get("search") ?? ""
  const page = searchParams?.get("page") ?? "1"
  const limit = searchParams?.get("limit") ?? "10"

  const { data, isLoading } = useGetCategories({ page, limit, search })

  const total = data?.meta?.total ?? 0
  const offset = (Number(page) - 1) * Number(limit)

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Categories"
        total={total}
        action={{
          type: "button",
          label: "Add New",
          icon: <Plus className="size-4" />,
          onClick: () => setCreateOpen(true),
        }}
      />

      <div className="table-shadow m-4 flex flex-col gap-0 rounded-t-md rounded-b-md bg-white">
        <SearchBar title="Search by category name" />
        <div>
          <CategoryTable
            data={data?.data ?? []}
            isLoading={isLoading}
            offset={offset}
          />
        </div>
        {data?.meta && <DataPagination meta={data.meta} />}
      </div>

      <CategoryFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}

export default CategoryList
