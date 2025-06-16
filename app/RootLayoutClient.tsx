'use client'

import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Providers } from './providers'
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
  }, [])

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8HHHLV2GXW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8HHHLV2GXW');
          `}
        </Script>
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
