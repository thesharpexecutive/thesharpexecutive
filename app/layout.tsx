import type { Metadata } from 'next'
import RootLayoutClient from './RootLayoutClient'

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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8HHHLV2GXW"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8HHHLV2GXW');
            `,
          }}
        />
      </head>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
