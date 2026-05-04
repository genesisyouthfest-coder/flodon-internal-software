'use client'

import { useRouter } from 'next/navigation'

export default function BackButton({ fallback = '/admin/leads' }: { fallback?: string }) {
  const router = useRouter()

  return (
    <button 
      onClick={() => {
        if (window.history.length > 1) {
          router.back()
        } else {
          router.push(fallback)
        }
      }}
      className="text-sm font-bold uppercase tracking-widest hover:underline flex items-center gap-2"
    >
      &larr; Back to Leads
    </button>
  )
}
