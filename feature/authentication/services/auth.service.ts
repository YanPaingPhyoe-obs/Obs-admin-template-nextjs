import { authClient } from "@/api/client"
import type { ApiResponse } from "@/api/types"
import type {
  LoginFormValues,
  LoginResponse,
  ForgotPasswordResponse,
  OtpVerifyResponse,
} from "../types"

export const login = async (
  data: LoginFormValues
): Promise<ApiResponse<LoginResponse>> => {
  const response = await authClient.post<ApiResponse<LoginResponse>>(
    "/auth/admin/login",
    data
  )
  return response.data
}

export const logout = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
}

export const sendForgotPasswordOtp = async (
  email: string
): Promise<ApiResponse<ForgotPasswordResponse>> => {
  const response = await authClient.post<ApiResponse<ForgotPasswordResponse>>(
    "/auth/admin/forgot-password",
    { email }
  )
  return response.data
}

export const verifyForgotPasswordOtp = async (
  userId: string,
  code: string
): Promise<ApiResponse<OtpVerifyResponse>> => {
  const response = await authClient.post<ApiResponse<OtpVerifyResponse>>(
    "/auth/admin/forgot-password/verify",
    { userId, code }
  )
  return response.data
}

export const resetPassword = async (
  accessToken: string,
  newPassword: string
): Promise<ApiResponse<null>> => {
  const response = await authClient.post<ApiResponse<null>>(
    "/auth/admin/reset-password",
    { accessToken, newPassword }
  )
  return response.data
}
