"use client"

import { useParams } from "next/navigation"
import { useGetPermissions, useGetRoleById } from "../hooks/useRoles"
import RoleForm from "../components/RoleForm"

const RoleDetailPage = () => {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const { data: permissionData } = useGetPermissions()
  const { data: roleData } = useGetRoleById(id)

  const role = roleData?.data
  const defaultValues = role
    ? {
        name: role.name,
        description: role.description ?? "",
        permissionIds:
          role.permissionIds ??
          (role.rolePermissions?.map((rp) => rp.permissionId) ?? []),
      }
    : undefined

  return (
    <RoleForm
      title="Role Detail"
      isPending={false}
      permissionData={permissionData}
      defaultValues={defaultValues}
      readOnly
    />
  )
}

export default RoleDetailPage
