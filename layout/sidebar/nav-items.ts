import { LayoutDashboard, BookOpen, Users, Settings } from "lucide-react"

export type NavChild = { label: string; path: string }
export type NavItem = {
  label: string
  icon: React.ElementType
  path?: string
  children?: NavChild[]
}

export const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  {
    // Modal-based CRUD examples (Category, Genre)
    // Page-based CRUD examples (Package, Promotion)
    label: "Contents",
    icon: BookOpen,
    children: [
      { label: "Categories", path: "/videos/categories" },
      { label: "Packages", path: "/subscription/packages" },
      { label: "Meal Plans", path: "/meal-plans" },
      { label: "Meal Portions", path: "/meal-portions" },
      { label: "Promotions", path: "/subscription/promotions" },
    ],
  },
  {
    label: "Administration",
    icon: Users,
    children: [
      { label: "Admins", path: "/admins" },
      { label: "Roles", path: "/roles" },
      { label: "User Logs", path: "/admin-logs" },
      { label: "Audit Logs", path: "/audit-logs" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "SMTP", path: "/smtp" },
      { label: "Terms & Conditions", path: "/terms" },
      { label: "Privacy Policy", path: "/privacy" },
    ],
  },
]
