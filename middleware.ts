import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Allow NextAuth API routes to pass through
    if (pathname.startsWith('/api/auth')) {
      return NextResponse.next()
    }

    // Check if user is trying to access seller pages
    const isSellerPage = pathname.startsWith('/dashboard') || pathname.startsWith('/seller')
    
    if (isSellerPage) {
      // If no token or user role is not SELLER, redirect to home
      if (!token || token.role !== 'SELLER') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow NextAuth API routes
        if (pathname.startsWith('/api/auth')) {
          return true
        }
        
        // Allow access to public pages
        if (!pathname.startsWith('/dashboard') && !pathname.startsWith('/seller')) {
          return true
        }
        
        // For seller pages, require authentication and SELLER role
        return !!token && token.role === 'SELLER'
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/seller/:path*'
  ]
}