import { apiClient } from "@/api/client"
import type { Admin, Role } from "../types"
import type { ApiResponse, PaginatedApiResponse } from "@/api/types"

const endpoint = "/admin/admins"

export const getAllAdmins = async (
  queryString: string
): Promise<PaginatedApiResponse<Admin>> => {
  const response = await apiClient.get<PaginatedApiResponse<Admin>>(
    `${endpoint}?${queryString}`
  )
  return response.data
}

export const getAdminById = async (
  id: string | number
): Promise<ApiResponse<Admin>> => {
  const response = await apiClient.get<ApiResponse<Admin>>(`${endpoint}/${id}`)
  return response.data
}

export const createAdmin = async (
  data: FormData
): Promise<ApiResponse<Admin>> => {
  const response = await apiClient.post<ApiResponse<Admin>>(endpoint, data, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export const updateAdmin = async (
  id: string | number,
  data: FormData
): Promise<ApiResponse<Admin>> => {
  const response = await apiClient.patch<ApiResponse<Admin>>(
    `${endpoint}/${id}`,
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  )
  return response.data
}

export const deleteAdmin = async (
  id: string | number
): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `${endpoint}/${id}`
  )
  return response.data
}

export const getAdminRoles = async (): Promise<PaginatedApiResponse<Role>> => {
  const response = await apiClient.get<PaginatedApiResponse<Role>>("/roles")
  return response.data
}
