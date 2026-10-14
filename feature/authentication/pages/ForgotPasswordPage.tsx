"use client"

import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ForgotPasswordForm } from "../components/ForgotPasswordForm"

const ForgotPasswordPage = () => {
  const router = useRouter()

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
            Forgot Your Password
          </h1>
          <p className="text-sm text-muted-foreground">
            We'll send you the update instruction shortly.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export default ForgotPasswordPage
