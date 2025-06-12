'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isLoginPage = pathname === '/admin/login'
  
  // Set mounted state after initial render
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])
  
  // Only fetch session if not on login page and component is mounted
  const { data: session, status } = useSession({
    required: !isLoginPage,
    onUnauthenticated() {
      if (!isLoginPage && mounted) {
        console.log('[AdminLayout] User not authenticated, redirecting to login')
        const callbackUrl = encodeURIComponent(pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''))
        router.push(`/admin/login?callbackUrl=${callbackUrl}`)
      }
    },
  })

  // Only log in the browser
  useEffect(() => {
    if (mounted) {
      console.log('[AdminLayout] Session status:', status, 'Path:', pathname, 'Is Login Page:', isLoginPage)
    }
  }, [status, pathname, isLoginPage, mounted])

  // Handle redirect if already authenticated and on login page
  useEffect(() => {
    if (mounted && status === 'authenticated' && isLoginPage) {
      const callbackUrl = searchParams?.get('callbackUrl') || '/admin/dashboard'
      console.log('[AdminLayout] Already authenticated, redirecting to:', callbackUrl)
      
      // Use direct window.location navigation instead of router.push
      try {
        // First attempt with router
        router.push(callbackUrl)
        
        // Set a fallback with direct navigation after a short delay
        setTimeout(() => {
          if (window.location.pathname === '/admin/login') {
            console.log('[AdminLayout] Router redirect failed, using window.location')
            window.location.href = callbackUrl
          }
        }, 500)
      } catch (err) {
        console.error('[AdminLayout] Navigation error:', err)
        // Fallback to direct navigation
        window.location.href = callbackUrl
      }
    }
  }, [status, isLoginPage, searchParams, router, mounted])

  // If this is the login page, just render the children (login form)
  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading state while checking authentication or not mounted
  if (status === 'loading' || !mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If we have a session, render the admin layout
  if (session) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b bg-white">
          <div className="container flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {session.user?.email}
              </span>
              <button
                onClick={async () => {
                  const { signOut } = await import('next-auth/react')
                  await signOut({ redirect: false })
                  window.location.href = '/admin/login'
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>
        <nav className="bg-white py-2.5 border-b">
          <div className="container mx-auto">
            <div className="flex space-x-4">
              <Link
                href="/admin/dashboard"
                className={`px-3 py-2 text-sm font-medium ${pathname === '/admin/dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/posts"
                className={`px-3 py-2 text-sm font-medium ${pathname.startsWith('/admin/posts') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Posts
              </Link>
              <Link
                href="/admin/categories"
                className={`px-3 py-2 text-sm font-medium ${pathname.startsWith('/admin/categories') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Categories
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    )
  }

  // Fallback to a simple loading state
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
        <p className="text-gray-600">Preparing your session...</p>
      </div>
    </div>
  )
}
