"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { SidebarFooter, useSidebar } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProfile } from "@/feature/profile/hooks/useProfile"
import { ProfileSheet } from "@/feature/profile/components/ProfileSheet"
import { BASE_URL } from "@/api/client"
import { clearTokens } from "@/lib/auth/token"

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

export function SidebarUserFooter() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const { data: profile } = useProfile()
  const [profileOpen, setProfileOpen] = useState(false)

  const name = profile?.fullName ?? "User"
  const role = profile?.role?.name ?? ""
  const initials = getInitials(name)
  const imageUrl = getProfileImageUrl(profile?.profileImage ?? null)

  return (
    <>
      <SidebarFooter className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setProfileOpen(true)}>
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback className="bg-primary text-sm text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>

          {!isCollapsed && (
            <>
              <button
                onClick={() => setProfileOpen(true)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-sm font-semibold text-foreground">
                  {name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {role}
                </p>
              </button>
              <button
                onClick={() => {
                  clearTokens()
                  window.location.href = "/login"
                }}
                className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </SidebarFooter>

      <ProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  )
}
