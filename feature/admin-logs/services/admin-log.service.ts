import { apiClient } from "@/api/client"
import type { AdminLog } from "../types"
import type { PaginatedApiResponse } from "@/api/types"

const endpoint = "/user-logs"

export const getAllAdminLogs = async (
  params?: Record<string, unknown>
): Promise<PaginatedApiResponse<AdminLog>> => {
  const response = await apiClient.get<PaginatedApiResponse<AdminLog>>(endpoint, {
    params: { ...params, userType: "ADMIN" },
  })
  return response.data
}
