'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6">
        <div className="h-24 w-24 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-5xl font-bold mx-auto shadow-xl rotate-3">
          F
        </div>
        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved to another department.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button className="gap-2 px-8">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => typeof window !== 'undefined' && window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
      
      <div className="mt-20 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Flodon AI Agency. Internal Systems.
      </div>
    </div>
  )
}
