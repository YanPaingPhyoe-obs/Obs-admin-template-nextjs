import { Suspense } from "react"
import ResetPasswordPage from "@/feature/authentication/pages/ResetPasswordPage"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  )
}
