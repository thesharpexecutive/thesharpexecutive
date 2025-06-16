import type { Metadata } from 'next'
import RootLayoutClient from './RootLayoutClient'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'The Sharp Executive',
  description: 'Empowering businesses with strategic solutions and expert guidance',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 Tracking Code */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-8HHHLV2GXW`}
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
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
