"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRightIcon, EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { loginSchema } from "../types"
import type { LoginFormValues } from "../types"
import { useLogin } from "../hooks/useLogin"
import Link from "next/link"

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending } = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "arkarmin@obs.com.mm",
      password: "passwordD123!@#",
    },
    // defaultValues: {
    //   email: "",
    //   password: "",
    // },
  })

  const onSubmit = (values: LoginFormValues) => {
    login(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <h2 className="text-3xl leading-tight font-bold tracking-tight">
            Welcome back!
          </h2>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">
                Email Address <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="h-11 px-3"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">
                Password <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    autoComplete="current-password"
                    className="h-11 pr-11"
                    {...field}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={isPending}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Link
            href="/login/forget-password"
            className="text-end text-sm font-medium text-primary transition-colors hover:text-foreground"
          >
            Forgot password?
          </Link>
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
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRightIcon className="size-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
