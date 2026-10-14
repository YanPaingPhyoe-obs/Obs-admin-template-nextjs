import { apiClient } from "@/api/client"
import type { AuditLog } from "../types"
import type { PaginatedApiResponse } from "@/api/types"

const endpoint = "/audit-logs?userType=ADMIN"

export const getAllAuditLogs = async (
  params?: Record<string, unknown>
): Promise<PaginatedApiResponse<AuditLog>> => {
  const response = await apiClient.get<PaginatedApiResponse<AuditLog>>(
    endpoint,
    {
      params: { ...params },
    }
  )
  return response.data
}
