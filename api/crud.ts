import { apiClient } from "./client"
import type { ApiResponse, PaginatedApiResponse } from "./types"

export class CrudService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  /**
   * Fetch a paginated list of resources
   */
  async getAll(params?: Record<string, any>): Promise<PaginatedApiResponse<T>> {
    const response = await apiClient.get<PaginatedApiResponse<T>>(
      this.endpoint,
      { params }
    )
    return response.data
  }

  /**
   * Fetch a single resource by its ID
   */
  async getById(id: string | number): Promise<ApiResponse<T>> {
    const response = await apiClient.get<ApiResponse<T>>(
      `${this.endpoint}/${id}`
    )
    return response.data
  }

  /**
   * Create a new resource
   */
  async create(data: CreateDto): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(this.endpoint, data)
    return response.data
  }

  /**
   * Update an existing resource
   */
  async update(id: string | number, data: UpdateDto): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(
      `${this.endpoint}/${id}`,
      data
    )
    return response.data
  }

  /**
   * Delete a resource
   */
  async delete(id: string | number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${this.endpoint}/${id}`
    )
    return response.data
  }
}
