"use client"

import { useRouter } from "next/navigation"
import { useCreateRole, useGetPermissions } from "../hooks/useRoles"
import RoleForm from "../components/RoleForm"

const CreateRolePage = () => {
  const router = useRouter()
  const { data: permissionData } = useGetPermissions()
  const { mutate: createRole, isPending } = useCreateRole()

  return (
    <RoleForm
      title="Add New Role"
      isPending={isPending}
      permissionData={permissionData}
      onSubmit={(payload) =>
        createRole(payload, { onSuccess: () => router.push("/roles") })
      }
    />
  )
}

export default CreateRolePage
