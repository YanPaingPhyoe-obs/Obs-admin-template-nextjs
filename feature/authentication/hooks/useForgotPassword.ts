"use client"

import { useMutation } from "@/lib/swr"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { sendForgotPasswordOtp } from "../services/auth.service"
import type { ForgotPasswordFormValues } from "../types"
import type { AxiosError } from "axios"

export const useForgotPassword = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: ({ email }: ForgotPasswordFormValues) =>
      sendForgotPasswordOtp(email),
    onSuccess: (response, variables) => {
      const userId = response.data?.userId
      const email = variables.email
      const atIndex = email.indexOf("@")
      const maskedEmail =
        atIndex > 0
          ? "*****" + email.slice(atIndex)
          : email

      if (typeof window !== "undefined") {
        localStorage.setItem("otpEmail", email)
        if (userId) sessionStorage.setItem("otpUserId", userId)
        sessionStorage.setItem("otpMaskedEmail", maskedEmail)
      }

      toast.success("OTP Sent", {
        description: response.message || "Check your email for the OTP code.",
      })
      router.push(`/otp-verification?userId=${encodeURIComponent(userId || "")}&maskedEmail=${encodeURIComponent(maskedEmail)}`)
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP. Please try again."
      toast.error("Error", { description: errorMessage })
    },
  })
}
