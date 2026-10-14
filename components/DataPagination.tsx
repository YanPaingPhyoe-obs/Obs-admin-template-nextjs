"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PaginatedMeta } from "@/api/types"

const LIMIT_OPTIONS = [10, 20, 50, 100]

type DataPaginationProps = {
  meta: PaginatedMeta
}

export function DataPagination({ meta }: DataPaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { total, page, limit, totalPages } = meta

  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const updateQueryParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "")
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value)
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  const setPage = (newPage: number) => {
    updateQueryParams({ page: String(newPage) })
  }

  const setLimit = (newLimit: string) => {
    updateQueryParams({ limit: newLimit, page: "1" })
  }

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages]
    }
    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    }
    return [1, "...", page - 1, page, page + 1, "...", totalPages]
  }

  return (
    <div className="flex items-center justify-between rounded-b-lg bg-white px-4 py-4">
      {/* Left: showing range */}
      <p className="text-[13px] font-medium whitespace-nowrap text-foreground">
        Showing {from}-{to} out of {total}
      </p>

      {/* Center: page navigation */}
      <Pagination className="flex-1">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page > 1) setPage(page - 1)
              }}
              aria-disabled={page <= 1}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(p as number)
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page < totalPages) setPage(page + 1)
              }}
              aria-disabled={page >= totalPages}
              className={
                page >= totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Right: count per page */}
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="text-[13px] font-medium text-foreground">
          Count per page
        </span>
        <Select value={String(limit)} onValueChange={setLimit}>
          <SelectTrigger className="h-8 w-[60px] bg-[#f3f4f6] text-sm font-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIMIT_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={String(opt)}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
