'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// Debug helper
const log = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Login]', ...args)
  }
}

// Maximum number of login attempts before rate limiting
const MAX_LOGIN_ATTEMPTS = 3
const RATE_LIMIT_DURATION = 5 * 60 * 1000 // 5 minutes

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isRateLimited, setIsRateLimited] = useState(false)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const { status } = useSession()
  
  // Get callback URL from query params or default to /admin/dashboard
  const callbackUrl = searchParams?.get('callbackUrl') || '/admin/dashboard'
  
  // Handle rate limiting
  useEffect(() => {
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      setIsRateLimited(true)
      const timer = setTimeout(() => {
        setIsRateLimited(false)
        setLoginAttempts(0)
      }, RATE_LIMIT_DURATION)
      
      return () => clearTimeout(timer)
    }
  }, [loginAttempts])
  
  // If already logged in, redirect to callback or dashboard
  useEffect(() => {
    // Only run this effect in the browser
    if (typeof window === 'undefined') return
    
    if (status === 'authenticated') {
      log('Already authenticated, checking redirect...')
      
      // Only redirect if we're not already on the target page to prevent loops
      try {
        const targetPath = new URL(callbackUrl, window.location.origin).pathname
        const currentPath = window.location.pathname
        
        // Check if we're already on the login page and authenticated
        if (currentPath === '/admin/login' && status === 'authenticated') {
          log('Authenticated on login page, redirecting to dashboard')
          router.push('/admin/dashboard')
          return
        }
        
        // Only redirect if we're not already on the target path
        if (targetPath !== currentPath) {
          log(`Redirecting from ${currentPath} to:`, targetPath)
          router.push(targetPath)
        } else {
          log('Already on target page, preventing redirect loop')
        }
      } catch (error) {
        console.error('Error in redirect logic:', error)
        // Fallback to dashboard if there's an error with the callback URL
        router.push('/admin/dashboard')
      }
    } else if (status === 'unauthenticated') {
      log('User is not authenticated, showing login form')
    }
  }, [status, callbackUrl])
  
  // Handle successful login
  const handleSuccess = async () => {
    log('Login successful, redirecting to dashboard')
    
    try {
      // Force a hard navigation to the dashboard
      window.location.href = '/admin/dashboard'
    } catch (err) {
      console.error('Navigation error:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Check rate limiting
    if (isRateLimited) {
      setError('Too many login attempts. Please try again later.')
      return
    }
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    
    if (isLoading) return
    
    setIsLoading(true)
    setError('')
    
    try {
      log(`Login attempt ${loginAttempts + 1} with email:`, email)
      
      // Add a small delay to prevent brute force
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // First attempt: Try direct navigation approach
      try {
        // Use signIn with redirect: true first
        await signIn('credentials', {
          redirect: true,
          email,
          password,
          callbackUrl: '/admin/dashboard'
        })
        
        // If we get here, the redirect failed
        log('Direct redirect failed, trying fallback')
        
        // Second attempt: Try signIn with redirect: false
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password
        })
        
        log('Sign in result:', result)
        
        if (result?.error) {
          // Handle specific error cases
          let errorMsg = 'An error occurred during login'
          
          if (result.error === 'CredentialsSignin') {
            errorMsg = 'Invalid email or password'
          } else if (result.error.includes('too many')) {
            errorMsg = 'Too many attempts. Please try again later.'
            setIsRateLimited(true)
          } else if (result.error) {
            errorMsg = result.error
          }
          
          log('Login error:', { error: result.error, message: errorMsg })
          setError(errorMsg)
          
          // Increment login attempts on failure
          setLoginAttempts(prev => {
            const attempts = prev + 1
            if (attempts >= MAX_LOGIN_ATTEMPTS) {
              setIsRateLimited(true)
              setError('Too many failed attempts. Please try again later.')
            }
            return attempts
          })
        } else {
          // Login successful but redirect failed
          log('Login successful, using manual navigation')
          // Reset login attempts on success
          setLoginAttempts(0)
          
          // Use handleSuccess for navigation
          handleSuccess()
        }
      } catch (err) {
        log('Error during sign in process:', err)
        setError('An unexpected error occurred. Please try again.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred during login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
              return to the homepage
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || isRateLimited}
              className={`group relative flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${isLoading || isRateLimited ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
