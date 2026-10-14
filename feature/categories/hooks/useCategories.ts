"use client"

import useSWR, { mutate } from "swr"
import { useMutation } from "@/lib/swr"
import { toast } from "sonner"
import type { AxiosError } from "axios"
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory as deleteCategoryService,
} from "../services/category.service"
import type { Category } from "../types"
import type { ApiResponse } from "@/api/types"

const invalidateCategories = () => {
  mutate((key) => Array.isArray(key) && key[0] === "categories")
}

export const useGetCategories = (
  params?: Record<string, string | undefined>
) => {
  return useSWR(["categories", params], () => getAllCategories(params))
}

export const useCreateCategory = () => {
  return useMutation<
    ApiResponse<Category>,
    { name: string },
    AxiosError<{ message: string }>
  >({
    mutationFn: (data) => createCategory(data),
    onSuccess: (response) => {
      invalidateCategories()
      toast.success("Category created", {
        description:
          response.message || "Category has been created successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to create category", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useUpdateCategory = () => {
  return useMutation<
    ApiResponse<Category>,
    { id: string; data: { name: string } },
    AxiosError<{ message: string }>
  >({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: (response) => {
      invalidateCategories()
      toast.success("Category updated", {
        description:
          response.message || "Category has been updated successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to update category", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useDeleteCategory = () => {
  return useMutation<
    ApiResponse<void>,
    string,
    AxiosError<{ message: string }>
  >({
    mutationFn: (id) => deleteCategoryService(id),
    onSuccess: () => {
      invalidateCategories()
      toast.success("Category deleted", {
        description: "Category has been deleted successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to delete category", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}
