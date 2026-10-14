"use client"

import { UserRoundIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Admin } from "../types"
import { formatDate } from "date-fns"

type AdminDetailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  admin?: Admin
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "border border-green-500 text-green-600 bg-green-50",
  },
  suspended: {
    label: "Suspend",
    className: "border border-yellow-500 text-yellow-600 bg-yellow-50",
  },
  inactive: {
    label: "Inactive",
    className: "border border-red-400 text-red-500 bg-red-50",
  },
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border/50 py-2.5 last:border-0">
      <span className="w-32 shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

export function AdminDetailDialog({
  open,
  onOpenChange,
  admin,
}: AdminDetailDialogProps) {
  if (!admin) return null

  const statusKey = admin.status ?? (admin.isBanned ? "suspended" : "active")
  const statusCfg = statusConfig[statusKey] ?? statusConfig.active

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Detail</DialogTitle>
        </DialogHeader>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 pb-2">
          <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
            {admin.profileImage ? (
              <img
                src={admin.profileImage}
                alt={admin.fullName}
                className="size-full object-cover"
              />
            ) : (
              <UserRoundIcon className="size-9 text-muted-foreground/50" />
            )}
          </div>
          <div className="text-center">
            <p className="font-semibold">{admin.fullName}</p>
            <p className="text-sm text-muted-foreground">
              {admin.role?.name ?? "—"}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 px-4 py-1">
          <DetailRow label="Email" value={admin.email} />
          <DetailRow
            label="Status"
            value={
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  statusCfg.className
                )}
              >
                {statusCfg.label}
              </span>
            }
          />
          <DetailRow
            label="Joined"
            value={formatDate(admin.createdAt, "dd MMM yyyy")}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
