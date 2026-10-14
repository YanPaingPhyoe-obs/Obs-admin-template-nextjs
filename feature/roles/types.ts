import { z } from "zod"

export type PermissionAction = "READ" | "UPDATE" | "CREATE" | "DELETE"

export interface PermissionModule {
  id: string
  name: string
  code: string
  parentId: string | null
  children?: Array<{
    id: string
    name: string
    code: string
    parentId: string | null
  }>
}

export interface Permission {
  id: string
  action: PermissionAction
  module: PermissionModule
}

export interface RolePermission {
  roleId: string
  permissionId: string
  permission?: Permission
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions?: Permission[]
  permissionIds?: string[]
  rolePermissions?: RolePermission[]
}

export const roleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  permissionIds: z
    .array(z.string())
    .min(1, "At least one permission is required"),
})

export type RoleFormValues = z.infer<typeof roleFormSchema>
