import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// List of public paths that don't require authentication
const publicPaths = [
  '/',
  '/admin/login',
  '/api/auth',
  '/api/auth/callback',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/session',
  '/api/auth/csrf',
  '/api/auth/providers',
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
  
  // Always log the request for debugging
  console.log(`[Middleware] Processing request: ${pathname}`)
  
  // PRODUCTION FIX: Special handling for callback URLs to prevent redirect loops
  if (search && search.includes('callbackUrl')) {
    console.log(`[Middleware] Detected callback URL in request: ${search}`)
    
    // If we're on the login page with a callbackUrl parameter, just let it through
    // This prevents redirect loops during the authentication process
    if (pathname === '/admin/login') {
      console.log('[Middleware] Allowing login page with callbackUrl to proceed')
      return NextResponse.next()
    }
  }
  
  // Skip middleware for public paths
  if (isPublicPath(pathname)) {
    console.log(`[Middleware] Public path detected: ${pathname}`)
    
    // Special case: If user is already authenticated and trying to access login page, redirect to dashboard
    // But ONLY if there's no callbackUrl in the search params (to prevent loops)
    if (pathname === '/admin/login' && !search.includes('callbackUrl')) {
      try {
        const token = await getToken({
          req: request,
          secret: process.env.NEXTAUTH_SECRET,
          secureCookie: process.env.NODE_ENV === 'production'
        })
        
        if (token) {
          console.log('[Middleware] User already authenticated, redirecting to dashboard')
          const dashboardUrl = new URL('/admin/dashboard', request.url)
          return NextResponse.redirect(dashboardUrl)
        }
      } catch (error) {
        console.error('[Middleware] Error checking token:', error)
      }
    }
    
    return NextResponse.next()
  }

  console.log(`[Middleware] Protected path detected: ${pathname}`)
  
  try {
    // PRODUCTION FIX: Special handling for dashboard access attempts
    if (pathname === '/admin/dashboard') {
      console.log('[Middleware] Dashboard access attempt detected')
    }
    
    // Get the token from the request with explicit options
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production'
    })
    
    // Debug token information
    console.log(`[Middleware] Token check result:`, token ? 'Token found' : 'No token')
    
    // If no token, redirect to login with callback URL
    if (!token) {
      console.log('[Middleware] No token found, redirecting to login')
      const loginUrl = new URL('/admin/login', request.url)
      
      // PRODUCTION FIX: Only add callbackUrl if we're not already in a potential redirect loop
      // This prevents the middleware from creating endless redirect loops
      if (pathname !== '/admin/login' && !pathname.includes('/api/auth')) {
        loginUrl.searchParams.set('callbackUrl', pathname + search)
      }
      
      return NextResponse.redirect(loginUrl)
    }
    
    // User is authenticated, allow the request
    console.log(`[Middleware] User authenticated: ${token.email || 'unknown'}`)
    return NextResponse.next()
  } catch (error) {
    console.error('[Middleware] Authentication error:', error)
    
    // On error, redirect to login for safety
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  // Only run middleware on admin dashboard routes
  // This prevents the middleware from interfering with NextAuth's authentication flow
  matcher: [
    // Only protect the dashboard and other admin routes, but NOT login
    '/admin/dashboard/:path*',
    '/admin/users/:path*',
    '/admin/settings/:path*',
    '/admin/content/:path*',
  ],
}
