import { Suspense } from "react"
import ForgotPasswordPage from "@/feature/authentication/pages/ForgotPasswordPage"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordPage />
    </Suspense>
  )
}
