'use client'

import React, { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Check if already logged in and redirect
  useEffect(() => {
    if (status === 'authenticated' && session) {
      console.log('PRODUCTION FIX: Already authenticated, redirecting to dashboard')
      router.push('/admin/dashboard')
    }
  }, [status, session, router])

  
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
      console.log('PRODUCTION HARD FIX: Attempting login with email:', email)
      
      // Attempt login with redirect: false
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      })
      
      console.log('PRODUCTION HARD FIX: Sign in result:', result)
      
      if (result?.error) {
        // Handle error
        setError(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error)
        setIsLoading(false)
        return
      }
      
      // Success! Try multiple redirect approaches
      console.log('PRODUCTION HARD FIX: Login successful, trying all redirect methods')
      
      // Method 1: Next.js router push
      router.push('/admin/dashboard')
      
      // Method 2: Direct window location change
      setTimeout(() => {
        console.log('PRODUCTION HARD FIX: Method 1 failed, trying direct location change')
        window.location.href = '/admin/dashboard'
        
        // Method 3: Hard refresh with absolute URL
        setTimeout(() => {
          console.log('PRODUCTION HARD FIX: Method 2 failed, trying hard refresh')
          const origin = window.location.origin
          window.location.replace(`${origin}/admin/dashboard`)
          
          // Method 4: Form submission to force server navigation
          setTimeout(() => {
            console.log('PRODUCTION HARD FIX: Method 3 failed, trying form submission')
            const form = document.createElement('form')
            form.method = 'POST'
            form.action = '/admin/dashboard'
            document.body.appendChild(form)
            form.submit()
          }, 500)
        }, 500)
      }, 500)
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <div className="text-sm text-center">
            <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Return to site
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
