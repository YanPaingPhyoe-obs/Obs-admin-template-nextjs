import { apiClient } from "@/api/client"
import type { Role, Permission } from "../types"
import type { ApiResponse, PaginatedApiResponse } from "@/api/types"

const endpoint = "/admin/roles"

export const getAllRoles = async (
  params?: Record<string, unknown>
): Promise<PaginatedApiResponse<Role>> => {
  const response = await apiClient.get<PaginatedApiResponse<Role>>(endpoint, {
    params,
  })
  return response.data
}

export const getRoleById = async (
  id: string | number
): Promise<ApiResponse<Role>> => {
  const response = await apiClient.get<ApiResponse<Role>>(`${endpoint}/${id}`)
  return response.data
}

export const createRole = async (
  data: Partial<Role>
): Promise<ApiResponse<Role>> => {
  const response = await apiClient.post<ApiResponse<Role>>(endpoint, data)
  return response.data
}

export const updateRole = async (
  id: string | number,
  data: Partial<Role>
): Promise<ApiResponse<Role>> => {
  const response = await apiClient.patch<ApiResponse<Role>>(
    `${endpoint}/${id}`,
    data
  )
  return response.data
}

export const deleteRole = async (
  id: string | number
): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `${endpoint}/${id}`
  )
  return response.data
}

export const getPermissions = async (): Promise<
  PaginatedApiResponse<Permission>
> => {
  const response =
    await apiClient.get<PaginatedApiResponse<Permission>>("/admin/permissions")
  return response.data
}
