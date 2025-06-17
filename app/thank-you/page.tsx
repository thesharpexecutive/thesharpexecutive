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
          <p className="text-xl font-semibold text-slate-800 mb-2">
            Ready for Your Next Step?
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 shadow-sm">
            <div className="flex flex-col items-center text-center mb-4">
              <h3 className="text-2xl font-bold text-blue-800 mb-3">Discover NeuroEnergizer</h3>
              <p className="text-slate-700 mb-4">Watch this short video to learn how you can optimize your mental performance and executive function.</p>
              
              <div className="w-full max-w-md bg-slate-200 rounded-lg mb-4 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <p className="text-slate-600 text-sm mb-2">Video Preview</p>
                  <Button asChild className="bg-red-600 hover:bg-red-700">
                    <Link href="https://neuroenergizer.com/explore?affiliate=boundcomm2" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                      Watch Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="https://neuroenergizer.com/explore?affiliate=boundcomm2" target="_blank" rel="noopener noreferrer">
                Learn More About NeuroEnergizer
              </Link>
            </Button>
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
