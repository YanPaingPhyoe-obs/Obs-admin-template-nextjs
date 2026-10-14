import { Suspense } from "react"
import CreateRolePage from "@/feature/roles/page/CreateRolePage"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CreateRolePage />
    </Suspense>
  )
}
