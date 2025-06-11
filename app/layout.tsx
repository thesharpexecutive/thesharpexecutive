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
  return <RootLayoutClient>{children}</RootLayoutClient>
}
