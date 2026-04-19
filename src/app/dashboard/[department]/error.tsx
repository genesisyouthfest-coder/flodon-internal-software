'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
        <AlertCircle className="h-10 w-10 text-red-600" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground max-w-[500px]">
          An error occurred while loading this dashboard section. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono mt-2">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Try again
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
          Go to Home
        </Button>
      </div>
    </div>
  )
}
