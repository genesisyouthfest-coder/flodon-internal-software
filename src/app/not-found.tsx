'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6">
        <div className="space-y-2 border-b-2 border-foreground pb-6">
          <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter uppercase">404</h1>
          <h2 className="text-xl md:text-3xl font-bold uppercase tracking-widest text-foreground/80 pt-4">Target Not Found</h2>
        </div>
        <p className="text-sm font-semibold tracking-widest uppercase pb-6 text-foreground/60 max-w-sm mx-auto">
          The requested coordinate is missing from the system grid.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="btn-solid px-8">
            Return to Dashboard
          </Link>
          <button onClick={() => typeof window !== 'undefined' && window.history.back()} className="btn-outline px-8">
            Go Back
          </button>
        </div>
      </div>
      
      <div className="mt-24 text-xs font-bold uppercase tracking-widest opacity-40">
        © {new Date().getFullYear()} Flodon System
      </div>
    </div>
  )
}
