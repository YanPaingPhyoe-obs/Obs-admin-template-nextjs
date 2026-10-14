"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OtpVerificationForm } from "../components/OtpVerificationForm"

const OtpVerificationPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [userId, setUserId] = useState<string>("")
  const [maskedEmail, setMaskedEmail] = useState<string>("")
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const id = searchParams?.get("userId") || sessionStorage.getItem("otpUserId") || ""
    const email = searchParams?.get("maskedEmail") || sessionStorage.getItem("otpMaskedEmail") || ""

    if (!id) {
      router.replace("/login/forget-password")
    } else {
      setUserId(id)
      setMaskedEmail(email)
      setIsReady(true)
    }
  }, [router, searchParams])

  if (!isReady) {
    return null
  }

  return (
    <div className="flex flex-col">
      <Button
        variant="secondary"
        className="w-fit gap-2 rounded-full px-5"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="size-4" />
        Back
      </Button>

      <div className="mx-auto mt-12 w-full max-w-lg">
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            OTP Verification
          </h1>
        </div>

        <OtpVerificationForm userId={userId} maskedEmail={maskedEmail} />
      </div>
    </div>
  )
}

export default OtpVerificationPage
