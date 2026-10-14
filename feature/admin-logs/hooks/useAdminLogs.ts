"use client"

import useSWR from "swr"
import { getAllAdminLogs } from "../services/admin-log.service"

export const useGetAdminLogs = (
  params?: Record<string, string | undefined>
) => {
  return useSWR(["admin-logs", params], () => getAllAdminLogs(params))
}
