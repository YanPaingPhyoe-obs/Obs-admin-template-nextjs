"use client"

import useSWR, { mutate } from "swr"
import { useMutation } from "@/lib/swr"
import {
  changePassword,
  getProfile,
  updateProfile,
} from "../services/profile.service"
import type { ApiResponse } from "@/api"
import type { Profile } from "../types"
import type { AxiosError } from "axios"
import { toast } from "sonner"

export const useProfile = () => {
  const { data, isLoading, error, ...rest } = useSWR("profile", async () => {
    const res = await getProfile()
    return res.data
  })

  return { data, isLoading, error, ...rest }
}

export const isAuthorized = (moduleCode: string, action: string) => {
  const { data, isLoading } = useProfile()
  if (isLoading) return true

  return data?.role?.rolePermissions?.some(
    (el: any) =>
      el.permission?.module?.code === moduleCode &&
      el.permission?.action === action.toUpperCase()
  )
}

export const useUpdateProfile = () => {
  return useMutation<
    ApiResponse<Profile>,
    { fullName: string },
    AxiosError<{ message: string }>
  >({
    mutationFn: updateProfile,
    onSuccess: (response) => {
      mutate("profile")
      toast.success("Profile Updated", {
        description: response.message || "Your profile has been updated.",
      })
    },
    onError: (error) => {
      toast.error("Update Failed", {
        description:
          error.response?.data?.message || "Failed to update profile.",
      })
    },
  })
}

export const useChangePassword = () => {
  return useMutation<
    ApiResponse<null>,
    { currentPassword: string; newPassword: string },
    AxiosError<{ message: string }>
  >({
    mutationFn: changePassword,
    onSuccess: (response) => {
      toast.success("Password Changed", {
        description:
          response.message || "Your password has been changed successfully.",
      })
    },
    onError: (error) => {
      toast.error("Password Change Failed", {
        description:
          error.response?.data?.message || "Failed to change password.",
      })
    },
  })
}
