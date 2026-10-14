"use client"

import useSWR, { mutate } from "swr"
import { useMutation } from "@/lib/swr"
import { toast } from "sonner"
import type { AxiosError } from "axios"
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
} from "../services/role.service"
import type { Role } from "../types"
import type { ApiResponse } from "@/api/types"

const roleService = {
  getAll: getAllRoles,
  getById: getRoleById,
  create: createRole,
  update: updateRole,
  delete: deleteRole,
  getPermissions,
}

const invalidateRoles = () => {
  mutate((key) => {
    if (typeof key === "string" && (key === "roles" || key === "permissions")) return true
    if (Array.isArray(key) && (key[0] === "roles" || key[0] === "role")) return true
    return false
  })
}

export const useGetRoles = (params?: Record<string, string | undefined>) => {
  return useSWR(["roles", params], () => roleService.getAll(params))
}

export const useGetRoleById = (id: string | undefined) => {
  return useSWR(id ? ["role", id] : null, () => roleService.getById(id!))
}

export const useGetPermissions = () => {
  return useSWR("permissions", () => roleService.getPermissions())
}

export const useCreateRole = () => {
  return useMutation<
    ApiResponse<Role>,
    Partial<Role>,
    AxiosError<{ message: string }>
  >({
    mutationFn: (data) => roleService.create(data),
    onSuccess: (response) => {
      invalidateRoles()
      toast.success("Role created", {
        description: response.message || "Role has been created successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to create role", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useUpdateRole = () => {
  return useMutation<
    ApiResponse<Role>,
    { id: string; data: Partial<Role> },
    AxiosError<{ message: string }>
  >({
    mutationFn: ({ id, data }) => roleService.update(id, data),
    onSuccess: (response) => {
      invalidateRoles()
      toast.success("Role updated", {
        description: response.message || "Role has been updated successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to update role", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useDeleteRole = () => {
  return useMutation<
    ApiResponse<void>,
    string,
    AxiosError<{ message: string }>
  >({
    mutationFn: (id) => roleService.delete(id),
    onSuccess: () => {
      invalidateRoles()
      toast.success("Role deleted", {
        description: "Role has been deleted successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to delete role", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}
