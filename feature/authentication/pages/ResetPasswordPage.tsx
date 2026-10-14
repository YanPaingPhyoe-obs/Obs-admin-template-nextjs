"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResetPasswordForm } from "../components/ResetPasswordForm"

const ResetPasswordPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [accessToken, setAccessToken] = useState<string>("")
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const token = searchParams?.get("accessToken") || sessionStorage.getItem("resetAccessToken") || ""

    if (!token) {
      router.replace("/login/forget-password")
    } else {
      setAccessToken(token)
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
            Reset Password
          </h1>
        </div>

        <ResetPasswordForm accessToken={accessToken} />
      </div>
    </div>
  )
}

export default ResetPasswordPage
