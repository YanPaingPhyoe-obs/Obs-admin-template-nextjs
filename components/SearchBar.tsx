"use client"

import React, { useEffect, useRef, useState } from "react"
import { Input } from "./ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

interface SearchBarProps {
  title: string
}

const SearchBar: React.FC<SearchBarProps> = ({ title }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchParam = searchParams?.get("search") || ""
  const [inputValue, setInputValue] = useState(searchParam)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setInputValue(searchParam)
  }, [searchParam])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams ? searchParams.toString() : "")
      if (value) {
        newParams.set("search", value)
      } else {
        newParams.delete("search")
      }
      newParams.set("page", "1") // reset to page 1 on search
      router.push(`${pathname}?${newParams.toString()}`)
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-t-md bg-white px-4 py-3">
      <div className="relative w-[340px] rounded bg-gray-100">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={title}
          value={inputValue}
          onChange={handleChange}
          className="h-10 border-none pl-9 text-[13px]"
        />
      </div>
    </div>
  )
}

export default SearchBar
