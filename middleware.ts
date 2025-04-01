import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  // Check if the user is trying to access protected routes
  if (
    request.nextUrl.pathname.startsWith("/api/auth/profile") ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/profile")
  ) {
    if (!token) {
      // If accessing API route, return 401
      if (request.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      }

      // Redirect to login page
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
      await jwtVerify(token, secret)

      return NextResponse.next()
    } catch (error) {
      // If token is invalid and accessing API route, return 401
      if (request.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      }

      // Redirect to login page
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  // Check if the user is trying to access auth pages while already logged in
  if (request.nextUrl.pathname.startsWith("/auth/") && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
      await jwtVerify(token, secret)

      // Redirect to home page if already logged in
      return NextResponse.redirect(new URL("/", request.url))
    } catch (error) {
      // Token is invalid, allow access to auth pages
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/profile/:path*", "/api/auth/profile/:path*", "/auth/:path*"],
}

