import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    console.log('Middleware running...')
    const token = req.nextauth.token

    if (!token) {
      console.log('No token found, redirecting to signin...')
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    console.log('Token found, proceeding...')
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/tasks/:path*"]
}