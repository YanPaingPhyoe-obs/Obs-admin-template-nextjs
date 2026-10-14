"use client"

import { useMutation } from "@/lib/swr"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { verifyForgotPasswordOtp } from "../services/auth.service"
import type { AxiosError } from "axios"

export const useOtpVerification = (userId: string) => {
  const router = useRouter()

  return useMutation({
    mutationFn: ({ code }: { code: string }) =>
      verifyForgotPasswordOtp(userId, code),
    onSuccess: (response) => {
      const accessToken = response.data?.accessToken
      if (typeof window !== "undefined" && accessToken) {
        sessionStorage.setItem("resetAccessToken", accessToken)
      }
      toast.success("OTP Verified", {
        description: "You can now reset your password.",
      })
      router.push(`/reset-password?accessToken=${encodeURIComponent(accessToken || "")}`)
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || "Invalid OTP. Please try again."
      toast.error("Verification Failed", { description: errorMessage })
    },
  })
}
