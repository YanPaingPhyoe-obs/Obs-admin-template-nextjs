import { Suspense } from "react"
import UpdateRolePage from "@/feature/roles/page/UpdateRolePage"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <UpdateRolePage />
    </Suspense>
  )
}
