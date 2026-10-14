"use client"

import { useMutation } from "@/lib/swr"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { login } from "../services/auth.service"
import type { LoginFormValues, LoginResponse } from "../types"
import type { ApiResponse } from "@/api/types"
import type { AxiosError } from "axios"
import { setTokens } from "@/lib/auth/token"

export const useLogin = () => {
  const router = useRouter()

  return useMutation<
    ApiResponse<LoginResponse>,
    LoginFormValues,
    AxiosError<{ message: string }>
  >({
    mutationFn: login,
    onSuccess: (response) => {
      // Save tokens in localStorage and cookies for proxy.ts
      if (response.data?.accessToken) {
        setTokens(response.data.accessToken, response.data.refreshToken)
      }

      toast.success("Login Successful", {
        description: response.message || "You have successfully logged in.",
      })
      router.push("/")
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Invalid credentials. Please try again."
      toast.error("Login Failed", {
        description: errorMessage,
      })
    },
  })
}
