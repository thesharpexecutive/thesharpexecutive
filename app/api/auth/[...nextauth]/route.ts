import NextAuth from 'next-auth'
import { authOptions } from './auth'
import { withCors } from '@/lib/cors'
import { NextRequest } from 'next/server'

// Create the NextAuth handler
const nextAuthHandler = NextAuth(authOptions)

// Wrap the handler with CORS middleware
const handler = (req: NextRequest) => {
  return nextAuthHandler(req)
}

// Export the handler with CORS support
export const GET = withCors(handler)
export const POST = withCors(handler)
