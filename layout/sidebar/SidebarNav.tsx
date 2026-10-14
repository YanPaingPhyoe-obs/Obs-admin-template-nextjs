"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { navItems, type NavItem } from "./nav-items"
import { useState, useMemo } from "react"

function isSectionActive(item: NavItem, pathname: string) {
  return item.path
    ? pathname === item.path
    : (item.children?.some((child) => pathname.startsWith(child.path)) ?? false)
}

export function SidebarNav({ search = "" }: { search?: string }) {
  const pathname = usePathname()

  const [openSections, setOpenSections] = useState<string[]>(() =>
    navItems
      .filter((item) =>
        item.children?.some((child) => pathname.startsWith(child.path))
      )
      .map((item) => item.label)
  )

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return navItems
    return navItems
      .map((item) => {
        if (item.label.toLowerCase().includes(q)) return item
        if (item.children) {
          const matchedChildren = item.children.filter((c) =>
            c.label.toLowerCase().includes(q)
          )
          if (matchedChildren.length > 0)
            return { ...item, children: matchedChildren }
        }
        return null
      })
      .filter(Boolean) as NavItem[]
  }, [search])

  const toggleSection = (label: string) => {
    setOpenSections((prev) => (prev.includes(label) ? [] : [label]))
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="mt-2 space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const active = isSectionActive(item, pathname)
            const isOpen = search.trim()
              ? true
              : openSections.includes(item.label)

            if (item.children) {
              return (
                <SidebarMenuItem key={item.label}>
                  <Collapsible
                    open={isOpen}
                    onOpenChange={() => toggleSection(item.label)}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.label}
                        className={cn(
                          isOpen &&
                            "!hover:text-black !bg-primary py-6 !text-white hover:!bg-primary/90",
                          "py-6"
                        )}
                      >
                        <Icon />
                        <span>{item.label}</span>
                        {isOpen ? (
                          <ChevronUp className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="!mx-0">
                      <SidebarMenuSub className="!mx-0 mt-4 space-y-2">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.path
                          return (
                            <SidebarMenuSubItem key={child.path}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isChildActive}
                                className={cn(
                                  isChildActive &&
                                    "border py-6 font-medium text-foreground"
                                )}
                              >
                                <Link
                                  className="block w-full py-6"
                                  href={child.path}
                                >
                                  {child.label}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              )
            }

            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.label}
                  className={cn(
                    active &&
                      "!bg-primary !text-white hover:bg-primary/90 hover:text-white",
                    "py-6"
                  )}
                >
                  <Link href={item.path!} className="block w-full">
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
