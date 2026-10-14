"use client"

import { getAllRoles } from "@/feature/roles/services/role.service"
import useSWR from "swr"

export const useRoles = () => {
  return useSWR("roles", () => getAllRoles())
}
