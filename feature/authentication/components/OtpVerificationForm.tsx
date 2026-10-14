import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { otpVerificationSchema } from "../types"
import type { OtpVerificationFormValues } from "../types"
import { useOtpVerification } from "../hooks/useOtpVerification"
import { useResendOtp } from "../hooks/useResendOtp"

interface OtpVerificationFormProps {
  userId: string
  maskedEmail: string
}

export const OtpVerificationForm = ({
  userId,
  maskedEmail,
}: OtpVerificationFormProps) => {
  const { mutate: verifyOtp, isPending } = useOtpVerification(userId)
  const { mutate: resendOtp, isPending: isResending } = useResendOtp()
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const form = useForm<OtpVerificationFormValues>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: { code: "" },
  })

  const onSubmit = (values: OtpVerificationFormValues) => {
    verifyOtp(values)
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        We have sent an OTP code to your email
        <br />
        <span className="font-semibold text-foreground">{maskedEmail}</span>
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">
                  OTP Code <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field} disabled={isPending}>
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="size-14 text-lg"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {countdown > 0 ? (
                <>
                  Resend in{" "}
                  <span className="font-medium text-foreground">
                    {countdown}s
                  </span>
                </>
              ) : (
                <button
                  type="button"
                  className="font-medium text-primary hover:underline disabled:opacity-50"
                  disabled={isPending || isResending}
                  onClick={() =>
                    resendOtp(undefined, { onSuccess: () => setCountdown(60) })
                  }
                >
                  {isResending ? "Sending..." : "Send Again"}
                </button>
              )}
            </span>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="h-11 gap-2 px-7 font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
