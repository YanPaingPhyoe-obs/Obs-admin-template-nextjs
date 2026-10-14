export interface AdminLog {
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
  metadata: Record<string, unknown> | null
  createdAt: string
  user: {
    profileImageUrl: string | null
  }
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
