'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton({ children, className }: { children: React.ReactNode, className?: string }) {
  const { pending } = useFormStatus()

  return (
    <button 
      type="submit" 
      disabled={pending} 
      className={className}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
          Processing...
        </span>
      ) : children}
    </button>
  )
}
