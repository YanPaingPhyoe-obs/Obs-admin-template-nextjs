import { z } from "zod"

export interface Role {
  id: string
  name: string
}

export interface Admin {
  id: string
  email: string
  fullName: string
  // phone: string
  roleId: string
  role: Role
  dateOfBirth: string
  gender: "male" | "female"
  isBanned: boolean
  status?: "active" | "suspended" | "inactive"
  profileImage: string | null
  createdAt: string
}

export const adminFormSchema = z.object({
  fullName: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || (/[a-z]/.test(val) && /[A-Z]/.test(val)),
      "Password must contain both uppercase and lowercase letters"
    ),
  roleId: z.string().min(1, "Role is required"),
  profileImage: z.any().optional(),
  // phone: z.string().min(1, "Phone number is required"),
})

export type AdminFormValues = z.infer<typeof adminFormSchema>
