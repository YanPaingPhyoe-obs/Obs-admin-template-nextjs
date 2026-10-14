"use client"

import { useState } from "react"
import { KeyRound } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useProfile } from "../hooks/useProfile"
import { ChangePasswordDialog } from "./ChangePasswordDialog"
import { EditProfileDialog } from "./UpdateProfileDialog"
import { BASE_URL } from "@/api/client"

interface ProfileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getProfileImageUrl(profileImage: string | null) {
  if (!profileImage) return ""
  if (profileImage.startsWith("http")) return profileImage
  return `${BASE_URL}/${profileImage}`
}

export function ProfileSheet({ open, onOpenChange }: ProfileSheetProps) {
  const { data: profile, isLoading } = useProfile()
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-md"
        >
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-center text-xl font-bold">
              Profile Setting
            </SheetTitle>
            <SheetDescription className="sr-only">
              View and manage your profile settings
            </SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <ProfileSkeleton />
          ) : profile ? (
            <div className="flex flex-col px-4">
              {/* Profile Card */}
              <div className="flex flex-col items-center py-8">
                <Avatar className="mb-4 h-24 w-24">
                  <AvatarImage
                    src={getProfileImageUrl(profile.profileImage)}
                    alt={profile.fullName}
                  />
                  <AvatarFallback className="bg-primary text-xl text-white">
                    {getInitials(profile.fullName)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-bold text-foreground">
                  {profile.fullName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {profile.role?.name}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setEditProfileOpen(true)}
                >
                  Edit Profile
                </Button>
              </div>

              <Separator />

              {/* Personal Information */}
              <div className="space-y-5 py-6">
                <h4 className="text-lg font-bold text-foreground">
                  Personal Information
                </h4>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="text-sm font-semibold text-foreground">
                    {profile.fullName}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm font-semibold text-foreground">
                    {profile.email}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="text-sm font-semibold text-foreground">
                    {profile.role?.name}
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => setChangePasswordOpen(true)}
                >
                  <KeyRound className="mr-2 size-4" />
                  Change Password
                </Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />

      {profile && (
        <EditProfileDialog
          open={editProfileOpen}
          onOpenChange={setEditProfileOpen}
          defaultValues={{ fullName: profile.fullName }}
        />
      )}
    </>
  )
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col px-4">
      <div className="flex flex-col items-center py-8">
        <Skeleton className="mb-4 h-24 w-24 rounded-full" />
        <Skeleton className="mb-2 h-5 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Separator />
      <div className="space-y-5 py-6">
        <Skeleton className="h-5 w-48" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-44" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
