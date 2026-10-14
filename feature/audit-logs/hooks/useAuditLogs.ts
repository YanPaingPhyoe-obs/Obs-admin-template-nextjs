"use client"

import useSWR from "swr"
import { getAllAuditLogs } from "../services/audit-log.service"

export const useGetAuditLogs = (
  params?: Record<string, string | undefined>
) => {
  return useSWR(["audit-logs", params], () => getAllAuditLogs(params))
}
