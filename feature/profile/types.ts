import { z } from "zod"
import type { Role } from "../roles/types"

export interface Profile {
  id: string
  email: string
  fullName: string
  phone: string
  roleId: string
  role: Role
  dateOfBirth: string
  gender: "male" | "female"
  profileImage: string | null
  createdAt: string
}

export const updateProfileSchema = z.object({
  fullName: z.string().min(1, { message: "Username is required" }),
})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
