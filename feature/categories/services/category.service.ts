import { apiClient } from "@/api/client"
import type { Category } from "../types"
import type { ApiResponse, PaginatedApiResponse } from "@/api/types"

const endpoint = "/content/categories"

export const getAllCategories = async (
  params?: Record<string, unknown>
): Promise<PaginatedApiResponse<Category>> => {
  const response = await apiClient.get<PaginatedApiResponse<Category>>(endpoint, { params })
  return response.data
}

export const getCategoryById = async (
  id: string | number
): Promise<ApiResponse<Category>> => {
  const response = await apiClient.get<ApiResponse<Category>>(`${endpoint}/${id}`)
  return response.data
}

export const createCategory = async (
  data: { name: string }
): Promise<ApiResponse<Category>> => {
  const response = await apiClient.post<ApiResponse<Category>>(endpoint, data)
  return response.data
}

export const updateCategory = async (
  id: string | number,
  data: { name: string }
): Promise<ApiResponse<Category>> => {
  const response = await apiClient.patch<ApiResponse<Category>>(`${endpoint}/${id}`, data)
  return response.data
}

export const deleteCategory = async (
  id: string | number
): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`${endpoint}/${id}`)
  return response.data
}
