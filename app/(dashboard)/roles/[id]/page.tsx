import { Suspense } from "react"
import RoleDetailPage from "@/feature/roles/page/RoleDetailPage"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RoleDetailPage />
    </Suspense>
  )
}
