import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuthenticated = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isPublicPage = ['/'].includes(req.nextUrl.pathname)

    // Store the current URL before redirection
    const currentPath = req.nextUrl.pathname
    const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') || currentPath

    // Allow API and public assets
    if (req.nextUrl.pathname.startsWith('/api') ||
      req.nextUrl.pathname.startsWith('/_next') ||
      req.nextUrl.pathname.includes('favicon.ico')) {
      return NextResponse.next()
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuthenticated) {
      const redirectUrl = new URL(callbackUrl, req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Allow access to public pages
    if (isPublicPage) {
      return NextResponse.next()
    }

    // Redirect unauthenticated users to login with callback URL
    if (!isAuthenticated && !isAuthPage) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', currentPath)
      return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => true
    },
  }
)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)'
  ]
}