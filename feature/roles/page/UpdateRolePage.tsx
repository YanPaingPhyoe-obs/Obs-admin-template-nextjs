"use client"

import { useParams, useRouter } from "next/navigation"
import {
  useGetPermissions,
  useGetRoleById,
  useUpdateRole,
} from "../hooks/useRoles"
import RoleForm from "../components/RoleForm"

const UpdateRolePage = () => {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params?.id
  const { data: permissionData } = useGetPermissions()
  const { data: roleData } = useGetRoleById(id)
  const { mutate: updateRole, isPending } = useUpdateRole()

  const role = roleData?.data
  const defaultValues = role
    ? {
        name: role.name,
        description: role.description ?? "",
        permissionIds:
          role.permissionIds ??
          role.rolePermissions?.map((rp) => rp.permissionId) ??
          [],
      }
    : undefined

  return (
    <RoleForm
      title="Edit Role"
      isPending={isPending}
      permissionData={permissionData}
      defaultValues={defaultValues}
      onSubmit={(payload) =>
        updateRole(
          { id: id!, data: payload },
          { onSuccess: () => router.push("/roles") }
        )
      }
    />
  )
}

export default UpdateRolePage
