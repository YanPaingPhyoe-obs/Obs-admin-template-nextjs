import Cookies from "js-cookie"

export const TOKEN_STORAGE_KEY = "accessToken"
export const REFRESH_TOKEN_STORAGE_KEY = "refreshToken"

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_STORAGE_KEY) || Cookies.get(TOKEN_STORAGE_KEY) || null
}

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) || null
}

export const setTokens = (accessToken: string, refreshToken?: string) => {
  if (typeof window === "undefined") return

  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken)
  // Set cookie for Next.js proxy and SSR checks (expires in 7 days)
  Cookies.set(TOKEN_STORAGE_KEY, accessToken, { expires: 7, path: "/", sameSite: "lax" })

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken)
  }
}

export const clearTokens = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
  Cookies.remove(TOKEN_STORAGE_KEY, { path: "/" })
}
