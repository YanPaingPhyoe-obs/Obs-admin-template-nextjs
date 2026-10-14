"use client"

import React from "react"
import { SWRConfig } from "swr"
import { apiClient } from "@/api/client"

type SWRProviderProps = {
  children: React.ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => apiClient.get(url).then((res) => res.data),
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  )
}
