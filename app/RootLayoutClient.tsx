'use client'

import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Providers } from './providers'
import { initGA, logPageView, GA_MEASUREMENT_ID } from '@/lib/analytics'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [mounted, setMounted] = useState(false)

  // This effect ensures we only render after mounting to avoid hydration mismatches
  useEffect(() => {
    setMounted(true)
    
    // Initialize Google Analytics
    initGA()
  }, [])
  
  // Track page views
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    if (pathname) {
      // Include search parameters if they exist
      const url = searchParams?.toString() 
        ? `${pathname}?${searchParams.toString()}` 
        : pathname
      logPageView(url)
    }
  }, [pathname, searchParams])

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Google Analytics Script */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`} suppressHydrationWarning>
        {mounted ? (
          <Providers>
            <SiteHeader />
            <main className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </Providers>
        ) : (
          // Show a simple loading state during SSR/SSG
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          </div>
        )}
      </body>
    </html>
  )
}
