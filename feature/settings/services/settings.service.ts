import { apiClient } from "@/api/client"
import type { ApiResponse } from "@/api/types"

const settingsEndpoint = "/settings"

export const getTermAndCondition = async (): Promise<
  ApiResponse<{ termAndCondition: string }>
> => {
  const response = await apiClient.get<
    ApiResponse<{ termAndCondition: string }>
  >(`${settingsEndpoint}/term-and-condition`)
  return response.data
}

export const updateTermAndCondition = async (
  data: { termAndCondition: string }
): Promise<ApiResponse<{ termAndCondition: string }>> => {
  const response = await apiClient.post<
    ApiResponse<{ termAndCondition: string }>
  >(`${settingsEndpoint}/term-and-condition`, data)
  return response.data
}

export const getPrivacyPolicy = async (): Promise<
  ApiResponse<{ privacyPolicy: string }>
> => {
  const response = await apiClient.get<
    ApiResponse<{ privacyPolicy: string }>
  >(`${settingsEndpoint}/privacy-policy`)
  return response.data
}

export const updatePrivacyPolicy = async (
  data: { privacyPolicy: string }
): Promise<ApiResponse<{ privacyPolicy: string }>> => {
  const response = await apiClient.post<
    ApiResponse<{ privacyPolicy: string }>
  >(`${settingsEndpoint}/privacy-policy`, data)
  return response.data
}

export type SmtpSettings = {
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  smtpUsername: string
  smtpPassword: string
  smtpFromEmail: string
  smtpFromName: string
  smtpEnabled: boolean
}

export const getSmtp = async (): Promise<ApiResponse<SmtpSettings>> => {
  const response = await apiClient.get<ApiResponse<SmtpSettings>>(
    `${settingsEndpoint}/smtp`
  )
  return response.data
}

export const updateSmtp = async (
  data: SmtpSettings
): Promise<ApiResponse<SmtpSettings>> => {
  const response = await apiClient.post<ApiResponse<SmtpSettings>>(
    `${settingsEndpoint}/smtp`,
    data
  )
  return response.data
}
