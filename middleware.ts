import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuthenticated = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isPublicPage = ['/'].includes(req.nextUrl.pathname)

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuthenticated) {
      return NextResponse.redirect(new URL('/tasks', req.url))
    }

    // Allow access to public pages
    if (isPublicPage) {
      return NextResponse.next()
    }

    // Redirect unauthenticated users to login
    if (!isAuthenticated && !isAuthPage) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => true // Let the middleware function handle the auth logic
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/).*)'
  ]
}