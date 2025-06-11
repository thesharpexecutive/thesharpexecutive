'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { ReactNode, useEffect, useState } from 'react'

// Debug component to log session status
function SessionDebugger() {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])
  
  // Only log in the browser
  useEffect(() => {
    if (mounted) {
      console.log('[SessionDebugger] Session status:', status)
      console.log('[SessionDebugger] Session data:', session)
    }
  }, [session, status, mounted])
  
  return null
}

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])
  
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    )
  }
  
  return (
    <SessionProvider
      // Disable automatic session fetching - we'll handle it manually
      session={undefined}
      // Base path for auth endpoints
      basePath="/api/auth"
    >
      <SessionDebugger />
      {children}
    </SessionProvider>
  )
}
