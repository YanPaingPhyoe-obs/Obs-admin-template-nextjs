import { Suspense } from "react"
import AuditLogList from "@/feature/audit-logs/page/AuditLogList"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuditLogList />
    </Suspense>
  )
}
