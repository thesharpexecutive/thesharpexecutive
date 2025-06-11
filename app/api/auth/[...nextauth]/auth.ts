import { type NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { Adapter } from 'next-auth/adapters'
import { prisma } from '@/lib/prisma'

// Ensure environment variables are set
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is not set')
}

// Debug helper
const log = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[NextAuth]', ...args)
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  // Configure cookies for better security and cross-origin support
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'development' ? 'localhost' : undefined,
      },
    },
  },
  // Configure JWT
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Configure session handling
  useSecureCookies: process.env.NODE_ENV === 'production',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter email and password')
          }

          log('Authorizing user:', { email: credentials.email })
          
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          })

          if (!user) {
            log('No user found with email:', credentials.email)
            throw new Error('Invalid email or password')
          }

          if (!user.password) {
            log('User has no password set:', user.id)
            throw new Error('Invalid email or password')
          }

          log('User found, verifying password...')
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            log('Invalid password for user:', user.id)
            throw new Error('Invalid email or password')
          }

          log('User authenticated successfully:', { id: user.id, email: user.email })
          
          return {
            id: user.id,
            email: user.email,
            name: user.name || null,
            role: user.role,
          }
        } catch (error) {
          log('Error in authorize:', error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      log('Session callback - Token:', token)
      
      if (token && session.user) {
        // Add user data to the session
        session.user.id = token.sub || ''
        session.user.role = token.role as string
        session.user.name = token.name || null
        session.user.email = token.email || null
        
        // Ensure we have all required fields
        if (!session.user.id || !session.user.role) {
          log('Session callback - Missing required fields in token:', { token })
          throw new Error('Invalid session data')
        }
      } else {
        log('Session callback - Missing token or user in session:', { token, hasUser: !!session?.user })
      }
      
      log('Session callback - Updated session:', session)
      return session
    },
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        log('JWT callback - User signed in:', { 
          id: user.id, 
          role: user.role,
          name: user.name,
          email: user.email
        });
      }
      
      return token;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}
