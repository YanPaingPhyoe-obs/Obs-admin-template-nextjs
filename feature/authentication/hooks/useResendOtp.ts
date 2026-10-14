"use client"

import { useMutation } from "@/lib/swr"
import { toast } from "sonner"
import { sendForgotPasswordOtp } from "../services/auth.service"
import type { AxiosError } from "axios"

export const useResendOtp = () => {
  return useMutation({
    mutationFn: () => {
      const email = typeof window !== "undefined" ? localStorage.getItem("otpEmail") : null
      if (!email) throw new Error("Email not found. Please go back and try again.")
      return sendForgotPasswordOtp(email)
    },
    onSuccess: (response) => {
      toast.success("OTP Resent", {
        description: response.message || "A new OTP code has been sent to your email.",
      })
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP. Please try again."
      toast.error("Error", { description: errorMessage })
    },
  })
}
