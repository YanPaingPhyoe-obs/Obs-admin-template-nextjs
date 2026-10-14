"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRoles } from "../hooks/useRoles"

export function AdminFilterSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { data: rolesData } = useRoles()
  const roles = rolesData?.data ?? []

  const search = searchParams?.get("search") ?? ""
  const roleId = searchParams?.get("roleId") ?? ""

  const updateParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams ? searchParams.toString() : "")
      updater(next)
      router.push(`${pathname}?${next.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const setParam = useCallback(
    (key: string, value: string) => {
      updateParams((next) => {
        if (value && value !== "all") {
          next.set(key, value)
        } else {
          next.delete(key)
        }
        next.set("page", "1")
      })
    },
    [updateParams]
  )

  const removeFilter = useCallback(
    (key: string) => {
      updateParams((next) => {
        next.delete(key)
        next.set("page", "1")
      })
    },
    [updateParams]
  )

  const clearFilters = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  const activeFilters = useMemo(() => {
    const filters: { label: string; key: string }[] = []
    if (search) filters.push({ label: `Search: ${search}`, key: "search" })
    if (roleId) {
      const role = roles.find((r) => r.id === roleId)
      filters.push({
        label: `Role: ${role?.name ?? roleId}`,
        key: "roleId",
      })
    }
    return filters
  }, [search, roleId, roles])

  return (
    <>
      <div className="flex w-full items-center justify-between gap-3 bg-white px-4 py-3">
        <div className="relative w-[340px] rounded bg-gray-100">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by admin name ..."
            value={search}
            onChange={(e) => setParam("search", e.target.value)}
            className="h-10 border-none pl-9 text-[13px]"
          />
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Select
            value={roleId || "all"}
            onValueChange={(v) => setParam("roleId", v)}
          >
            <SelectTrigger className="h-8 w-auto min-w-[160px] border-none bg-[#f3f4f6] text-[13px] font-medium">
              <SelectValue placeholder="Role : All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Role : All</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  Role : {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 bg-white px-4 py-2">
          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1 text-xs font-medium text-white"
            >
              {filter.label}
              <button
                onClick={() => removeFilter(filter.key)}
                className="rounded-full hover:bg-white/20"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearFilters}
            className="text-[13px] font-semibold text-foreground hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </>
  )
}
