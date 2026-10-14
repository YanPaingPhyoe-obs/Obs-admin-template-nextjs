"use client"

import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon, RefreshCwIcon, UserRoundIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { adminFormSchema, type Admin, type AdminFormValues } from "../types"
import { useCreateAdmin, useUpdateAdmin } from "../hooks/useAdmins"
import { useRoles } from "../hooks/useRoles"

type AdminFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  admin?: Admin
}

function generatePassword(length = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%"
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("")
}

export function AdminFormDialog({
  open,
  onOpenChange,
  admin,
}: AdminFormDialogProps) {
  const isCreate = !admin
  const { data: rolesData } = useRoles()
  const { mutate: createAdmin, isPending: isCreating } = useCreateAdmin()
  const { mutate: updateAdmin, isPending: isUpdating } = useUpdateAdmin()
  const isPending = isCreating || isUpdating

  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarPreviewRef = useRef<HTMLImageElement>(null)

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      roleId: "",
      profileImage: undefined,
    },
  })

  useEffect(() => {
    if (!open) return
    if (admin) {
      form.reset({
        fullName: admin.fullName,
        email: admin.email,
        password: "",
        roleId: admin.roleId,
        profileImage: undefined,
      })
    } else {
      form.reset({
        fullName: "",
        email: "",
        password: "",
        roleId: "",
        profileImage: undefined,
      })
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (avatarPreviewRef.current) avatarPreviewRef.current.src = ""
  }, [open, admin, form])

  const onSubmit = (values: AdminFormValues) => {
    if (isCreate && !values.password) {
      form.setError("password", { message: "Password is required" })
      return
    }

    const fd = new FormData()
    fd.append("email", values.email)
    fd.append("fullName", values.fullName)
    if (values.password) fd.append("password", values.password)
    fd.append("roleId", values.roleId)
    if (values.profileImage instanceof File) {
      fd.append("profileImage", values.profileImage)
    }

    if (isCreate) {
      createAdmin(fd, { onSuccess: () => onOpenChange(false) })
    } else {
      updateAdmin(
        { id: admin!.id, data: fd },
        { onSuccess: () => onOpenChange(false) }
      )
    }
  }

  const profileImageValue = form.watch("profileImage")
  const avatarSrc =
    profileImageValue instanceof File
      ? URL.createObjectURL(profileImageValue)
      : (admin?.profileImage ?? null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Add New Admin" : "Edit Admin"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <button
                type="button"
                className="relative size-20 rounded-full focus:outline-none"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
              >
                <div className="flex size-full items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="Profile"
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRoundIcon className="size-9 text-muted-foreground/50" />
                  )}
                </div>
                <span className="absolute right-0 bottom-0 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                  <span className="text-sm leading-none font-bold">+</span>
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  form.setValue("profileImage", file ?? undefined)
                }}
              />
            </div>

            {/* Role */}
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role <span className="text-destructive">*</span></FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select –" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rolesData?.data.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password{" "}
                    {isCreate ? (
                      <span className="text-destructive">*</span>
                    ) : (
                      <span className="font-normal text-muted-foreground">
                        (leave blank to keep)
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Password"
                        {...field}
                        disabled={isPending}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        disabled={isPending}
                        className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                        onClick={() => field.onChange(generatePassword())}
                        title="Generate random password"
                      >
                        <RefreshCwIcon className="size-4" />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                )}
                {isCreate ? "Create" : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
