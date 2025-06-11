import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-8">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Thank You for Subscribing!</h1>
        
        <p className="text-xl text-slate-600 mb-8">
          Your Executive Clarity Cheat-Sheet is on its way to your inbox.
          <span className="block mt-2 text-lg">
            (Check your spam folder if you don't see it within a few minutes)
          </span>
        </p>
        
        <div className="space-y-4 max-w-md mx-auto">
          <p className="text-slate-600">
            In the meantime, check out our latest blog posts:
          </p>
          
          <div className="space-y-3 text-left bg-slate-50 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-2 w-2 mt-2.5 bg-blue-600 rounded-full"></div>
              <div>
                <Link href="/blog" className="font-medium text-blue-600 hover:underline">
                  The 3-Step Executive Clarity System
                </Link>
                <p className="text-sm text-slate-500">Learn how top executives maintain focus all day</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-2 w-2 mt-2.5 bg-blue-600 rounded-full"></div>
              <div>
                <Link href="/blog" className="font-medium text-blue-600 hover:underline">
                  Morning Routines of Successful Leaders
                </Link>
                <p className="text-sm text-slate-500">Start your day with clarity and purpose</p>
              </div>
            </div>
          </div>
          
          <Button asChild className="mt-8 w-full sm:w-auto">
            <Link href="/" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              ← Back to Home
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
