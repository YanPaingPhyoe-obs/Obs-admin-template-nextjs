"use client"

import useSWR, { mutate } from "swr"
import { useMutation } from "@/lib/swr"
import { toast } from "sonner"
import type { AxiosError } from "axios"
import {
  getTermAndCondition,
  updateTermAndCondition,
  getPrivacyPolicy,
  updatePrivacyPolicy,
  getSmtp,
  updateSmtp,
  type SmtpSettings,
} from "../services/settings.service"
import type { ApiResponse } from "@/api/types"

export const useGetTermAndCondition = () => {
  return useSWR("term-and-condition", getTermAndCondition)
}

export const useUpdateTermAndCondition = () => {
  return useMutation<
    ApiResponse<{ termAndCondition: string }>,
    { termAndCondition: string },
    AxiosError<{ message: string }>
  >({
    mutationFn: (data) => updateTermAndCondition(data),
    onSuccess: (response) => {
      mutate("term-and-condition")
      toast.success("Terms & Conditions updated", {
        description:
          response.message ||
          "Terms & Conditions has been updated successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to update Terms & Conditions", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useGetPrivacyPolicy = () => {
  return useSWR("privacy-policy", getPrivacyPolicy)
}

export const useUpdatePrivacyPolicy = () => {
  return useMutation<
    ApiResponse<{ privacyPolicy: string }>,
    { privacyPolicy: string },
    AxiosError<{ message: string }>
  >({
    mutationFn: (data) => updatePrivacyPolicy(data),
    onSuccess: (response) => {
      mutate("privacy-policy")
      toast.success("Privacy Policy updated", {
        description:
          response.message || "Privacy Policy has been updated successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to update Privacy Policy", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useGetSmtp = () => {
  return useSWR("smtp", getSmtp)
}

export const useUpdateSmtp = () => {
  return useMutation<
    ApiResponse<SmtpSettings>,
    SmtpSettings,
    AxiosError<{ message: string }>
  >({
    mutationFn: (data) => updateSmtp(data),
    onSuccess: (response) => {
      mutate("smtp")
      toast.success("SMTP settings updated", {
        description:
          response.message || "SMTP settings have been updated successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to update SMTP settings", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}
