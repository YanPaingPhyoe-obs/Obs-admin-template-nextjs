import { Suspense } from "react"
import OtpVerificationPage from "@/feature/authentication/pages/OtpVerificationPage"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OtpVerificationPage />
    </Suspense>
  )
}
