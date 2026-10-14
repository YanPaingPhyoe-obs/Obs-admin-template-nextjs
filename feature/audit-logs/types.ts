export interface AuditLog {
  id: number
  userId: string | null
  adminId: string | null
  action: string
  description: string
  resourceType: string | null
  resourceId: string | null
  ipAddress: string | null
  userAgent: string | null
  device: string | null
  browser: string | null
  os: string | null
  location: string | null
  isActivityLog: boolean
  metadata: {
    method?: string
    url?: string
    body?: Record<string, unknown>
    [key: string]: unknown
  } | null
  createdAt: string
  user: {
    profileImageUrl: string | null
  } | null
  admin: {
    id: string
    fullName: string
    email: string
    profileImageUrl: string | null
    roleId: string
    isBanned: boolean
    twoFactorEnabled: boolean
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    lastLoginAt: string | null
  } | null
}
