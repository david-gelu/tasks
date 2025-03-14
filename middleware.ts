import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const isAuth = req.nextauth.token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/tasks', baseUrl))
      }
      return null
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth/signin', baseUrl))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ['/tasks/:path*', '/auth/:path*']
}