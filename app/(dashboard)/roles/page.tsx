import { Suspense } from "react"
import RoleList from "@/feature/roles/page/RoleList"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RoleList />
    </Suspense>
  )
}
