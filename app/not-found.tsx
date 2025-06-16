'use client'

import { Suspense } from 'react'
import Link from 'next/link'

// Component that uses useSearchParams safely inside Suspense
function NotFoundContent() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">The page you are looking for does not exist.</p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    }>
      <NotFoundContent />
    </Suspense>
  )
}
