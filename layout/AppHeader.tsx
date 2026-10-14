"use client"

import type { ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ButtonVariant =
  | "default"
  | "outline"
  | "ghost"
  | "destructive"
  | "secondary"
  | "link"

export type ButtonAction = {
  type: "button"
  label: string
  onClick: () => void
  variant?: ButtonVariant
  icon?: ReactNode
}

export type DropdownAction = {
  type: "dropdown"
  label: string
  items: { label: string; onClick: () => void }[]
  variant?: ButtonVariant
  icon?: ReactNode
}

export type NoAction = { type: "none" }

export type HeaderAction = ButtonAction | DropdownAction | NoAction

// ── Component ─────────────────────────────────────────────────────────────────

type AppHeaderProps = {
  title: string
  action?: HeaderAction
  total?: number
}

export function AppHeader({ title, action, total }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex shrink-0 items-center justify-between border-b border-border bg-white px-4 py-6">
      <div className="flex items-center gap-2">
        <h1 className="text-base font-bold text-foreground">{title}</h1>
        {total !== undefined && total > 0 && (
          <span className="rounded-md bg-[#f3f4f6] px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
            {total}
          </span>
        )}
      </div>

      {/* Right: action */}
      {action && action.type !== "none" && (
        <div>
          {action.type === "button" && (
            <Button
              size="sm"
              variant={action.variant ?? "default"}
              onClick={action.onClick}
            >
              {action.icon}
              {action.label}
            </Button>
          )}

          {action.type === "dropdown" && (
            <div className="flex items-center">
              <Button
                size="sm"
                onClick={action.items[0]?.onClick}
                className="rounded-r-none"
              >
                {action.icon}
                {action.label}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant={action.variant ?? "default"}
                    className="rounded-l-none border-l border-l-border/50 px-2"
                  >
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {action.items.map((item) => (
                    <DropdownMenuItem key={item.label} onClick={item.onClick}>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
