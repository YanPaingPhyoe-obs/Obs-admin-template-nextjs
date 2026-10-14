export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T = any> {
  data: T
  message?: string
  status?: number
}

export interface PaginatedApiResponse<T> {
  data: T[]
  meta: PaginatedMeta
  message?: string
  status?: number
}
