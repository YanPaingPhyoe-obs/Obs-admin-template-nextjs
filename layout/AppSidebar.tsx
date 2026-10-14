"use client"

import { Search, PanelLeft, PanelLeftClose } from "lucide-react"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { SidebarNav } from "./sidebar/SidebarNav"
import { SidebarUserFooter } from "./sidebar/SidebarUserFooter"

export function AppSidebar() {
  const { toggleSidebar, state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [search, setSearch] = useState("")

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-white">
      {/* ── Header ── */}
      <SidebarHeader className="pt-4 pb-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <img src="/logo.png" alt="Logo" className="h-8 w-8 shrink-0" />
              <span className="truncate text-base font-bold text-foreground">
                OBS Co.Ltd
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {isCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="relative mt-4">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search ...."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md bg-neutral-200 py-2.5 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        )}
      </SidebarHeader>

      {/* ── Nav ── */}
      <SidebarContent>
        <SidebarNav search={search} />
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarUserFooter />
    </Sidebar>
  )
}
