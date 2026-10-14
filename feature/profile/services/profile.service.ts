import { apiClient } from "@/api/client"
import type { ApiResponse } from "@/api/types"
import type { Profile } from "../types"

export const getProfile = async (): Promise<ApiResponse<Profile>> => {
  const response = await apiClient.get<ApiResponse<Profile>>("/auth/me")
  return response.data
}

export const updateProfile = async (data: {
  fullName: string
}): Promise<ApiResponse<Profile>> => {
  const response = await apiClient.patch<ApiResponse<Profile>>("/auth/me", data)
  return response.data
}

export const changePassword = async (data: {
  currentPassword: string
  newPassword: string
}): Promise<ApiResponse<null>> => {
  const response = await apiClient.patch<ApiResponse<null>>(
    "/auth/change-password",
    data
  )
  return response.data
}
