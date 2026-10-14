"use client"

import useSWR, { mutate } from "swr"
import { useMutation } from "@/lib/swr"
import { toast } from "sonner"
import type { AxiosError } from "axios"
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin as deleteAdminService,
} from "../services/admin.service"
import type { Admin } from "../types"
import type { ApiResponse } from "@/api/types"

const invalidateAdmins = () => {
  mutate((key) => Array.isArray(key) && key[0] === "admins")
}

export const useGetAdmins = (queryString: string) => {
  return useSWR(["admins", queryString], () => getAllAdmins(queryString))
}

export const useCreateAdmin = () => {
  return useMutation<
    ApiResponse<Admin>,
    FormData,
    AxiosError<{ message: string; details?: string[] }>
  >({
    mutationFn: (data) => createAdmin(data),
    onSuccess: (response) => {
      invalidateAdmins()
      toast.success("Admin created", {
        description: response.message || "Admin has been created successfully.",
      })
    },
    onError: (error) => {
      const data = error.response?.data
      toast.error(data?.message || "Failed to create admin", {
        description: data?.details?.join("\n"),
      })
    },
  })
}

export const useUpdateAdmin = () => {
  return useMutation<
    ApiResponse<Admin>,
    { id: string; data: FormData },
    AxiosError<{ message: string; details?: string[] }>
  >({
    mutationFn: ({ id, data }) => updateAdmin(id, data),
    onSuccess: (response) => {
      invalidateAdmins()
      toast.success("Admin updated", {
        description: response.message || "Admin has been updated successfully.",
      })
    },
    onError: (error) => {
      const data = error.response?.data
      toast.error(data?.message || "Failed to update admin", {
        description: data?.details?.join("\n"),
      })
    },
  })
}

export const useDeleteAdmin = () => {
  return useMutation<
    ApiResponse<void>,
    string,
    AxiosError<{ message: string; details?: string[] }>
  >({
    mutationFn: (id) => deleteAdminService(id),
    onSuccess: () => {
      invalidateAdmins()
      toast.success("Admin deleted", {
        description: "Admin has been deleted successfully.",
      })
    },
    onError: (error) => {
      const data = error.response?.data
      toast.error(data?.message || "Failed to delete admin", {
        description: data?.details?.join("\n"),
      })
    },
  })
}
