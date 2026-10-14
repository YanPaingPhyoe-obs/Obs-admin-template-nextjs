import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Public routes accessible without authentication
const PUBLIC_AUTH_PATHS = [
  "/login",
  "/forget-password",
  "/otp-verification",
  "/reset-password",
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("accessToken")?.value

  const isAuthPage = PUBLIC_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  // 1. Unauthenticated users trying to access protected routes -> redirect to /login
  if (!token && !isAuthPage) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Authenticated users trying to access login or auth routes -> redirect to /
  if (token && isAuthPage) {
    const homeUrl = new URL("/", request.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - static files (.svg, .png, .jpg, .ico, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
