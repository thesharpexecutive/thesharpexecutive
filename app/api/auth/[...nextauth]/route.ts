import NextAuth from 'next-auth'
import { authOptions } from './auth'
import { NextRequest } from 'next/server'

// Create the NextAuth handler
const handler = NextAuth(authOptions)

// Export the handler directly - NextAuth has its own CORS handling
export { handler as GET, handler as POST }
