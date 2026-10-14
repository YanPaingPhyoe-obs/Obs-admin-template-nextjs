import { Suspense } from "react"
import AdminList from "@/feature/admin/page/AdminList"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminList />
    </Suspense>
  )
}
