"use client"

import { useMutation } from "@/lib/swr"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { resetPassword } from "../services/auth.service"
import type { AxiosError } from "axios"

export const useResetPassword = (accessToken: string) => {
  const router = useRouter()

  return useMutation({
    mutationFn: ({ newPassword }: { newPassword: string }) =>
      resetPassword(accessToken, newPassword),
    onSuccess: (response) => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("resetAccessToken")
        sessionStorage.removeItem("otpUserId")
        sessionStorage.removeItem("otpMaskedEmail")
      }
      toast.success("Password Reset", {
        description:
          response.message || "Your password has been reset successfully.",
      })
      router.push("/login")
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to reset password. Please try again."
      toast.error("Error", { description: errorMessage })
    },
  })
}
