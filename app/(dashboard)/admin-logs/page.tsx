import { Suspense } from "react"
import AdminLogList from "@/feature/admin-logs/page/AdminLogList"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminLogList />
    </Suspense>
  )
}
