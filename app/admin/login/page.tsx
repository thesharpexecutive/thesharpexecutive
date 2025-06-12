'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession, getSession } from 'next-auth/react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // NO AUTOMATIC SESSION CHECK - only redirect after explicit login
  // This prevents infinite redirect loops
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Basic validation
    if (!email || !password) {
      setError('Email and password are required')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      console.log('Attempting login with email:', email)
      
      // BRUTE FORCE APPROACH: Try multiple methods in sequence
      
      // Method 1: Try direct signIn with redirect
      try {
        console.log('Trying method 1: signIn with redirect=true')
        await signIn('credentials', {
          redirect: true,
          callbackUrl: '/admin/dashboard',
          email,
          password
        })
        
        // If we get here, the redirect failed
        console.log('Method 1 failed to redirect')
      } catch (e) {
        console.log('Method 1 error:', e)
      }
      
      // Method 2: Try signIn without redirect and check result
      console.log('Trying method 2: signIn with redirect=false')
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      })
      
      console.log('Method 2 sign in result:', result)
      
      if (result?.error) {
        // Handle error
        let errorMsg = 'Invalid email or password'
        if (result.error !== 'CredentialsSignin') {
          errorMsg = result.error
        }
        
        setError(errorMsg)
      } else {
        // Success! Try multiple force navigation approaches
        console.log('Login successful, forcing navigation to dashboard')
        
        // Method 3: Try router.push
        try {
          // Force a hard navigation to dashboard
          console.log('CRITICAL: Forcing navigation to dashboard')
          document.cookie = 'auth_redirect=dashboard; path=/; max-age=60;'
          
          // Method 3a: window.location.replace (most direct)
          window.location.replace('/admin/dashboard')
          
          // Method 3b: Fallback to window.location.href
          setTimeout(() => {
            console.log('Fallback to window.location.href')
            window.location.href = '/admin/dashboard'
          }, 100)
        } catch (e) {
          console.error('Navigation error:', e)
          // Last resort
          window.location.href = '/admin/dashboard'
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred')
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
              disabled={isLoading}
              className={`group relative flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
