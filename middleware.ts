import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// List of public paths that don't require authentication
const publicPaths = [
  '/',
  '/admin/login',
  '/api/auth',
  '/_next',
  '/favicon.ico'
]

// Check if the current path is public
const isPublicPath = (pathname: string): boolean => {
  // Allow all Next.js internal paths and static files
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/api/') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.css') ||
      pathname.endsWith('.js')) {
    return true
  }
  
  return publicPaths.some(path => {
    if (path.endsWith('*')) {
      return pathname.startsWith(path.slice(0, -1))
    }
    return pathname === path || pathname.startsWith(`${path}/`)
  })
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  
  // Skip middleware for public paths
  if (isPublicPath(pathname)) {
    console.log(`[Middleware] Allowing public path: ${pathname}`)
    
    // If user is already authenticated and trying to access login page, redirect to dashboard
    if (pathname === '/admin/login') {
      const token = await getToken({ req: request })
      if (token) {
        console.log('[Middleware] User already authenticated, redirecting to dashboard')
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
    }
    
    return NextResponse.next()
  }

  console.log(`[Middleware] Checking auth for protected path: ${pathname}`)
  
  // Get the token from the request
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  
  // If no token, redirect to login with callback URL
  if (!token) {
    console.log('[Middleware] No token found, redirecting to login')
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname + search)
    return NextResponse.redirect(loginUrl)
  }
  
  // User is authenticated, allow the request
  console.log(`[Middleware] User authenticated: ${token.email}`)
  return NextResponse.next()
}

export const config = {
  // Only run middleware on admin routes
  matcher: ['/admin/:path*'],
}
