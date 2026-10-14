import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
  user: {
    id: string
  }
}

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export interface ForgotPasswordResponse {
  userId: string
}

export const otpVerificationSchema = z.object({
  code: z.string().length(6, { message: "OTP must be 6 digits" }),
})

export type OtpVerificationFormValues = z.infer<typeof otpVerificationSchema>

export interface OtpVerifyResponse {
  accessToken: string
}

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
