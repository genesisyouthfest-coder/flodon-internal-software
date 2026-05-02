'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

import { logout } from '@/app/login/actions'

interface MobileNavProps {
  items: {
    label: string
    href: string
  }[]
  logo: React.ReactNode
  footer?: React.ReactNode
}

export function MobileNav({ items, logo, footer }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] bg-background border-b-2 border-foreground h-16 flex items-center justify-between px-6">
      <div className="w-24">
        {logo}
      </div>

      <div className="flex items-center gap-4">
        <form action={logout}>
          <button type="submit" className="p-2 hover:bg-red-500 hover:text-background transition-colors border-2 border-transparent hover:border-foreground group/btn" title="Exit Pit Lane (Logout)">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square" className="transform -skew-x-12">
              <path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5" />
              <polyline points="15 17 20 12 15 7" />
              <line x1="20" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </form>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 -mr-2"
          aria-label="Toggle Menu"
        >
          <div className="space-y-1.5">
            <div className={cn("h-0.5 w-6 bg-foreground transition-all", isOpen && "rotate-45 translate-y-2")} />
            <div className={cn("h-0.5 w-6 bg-foreground transition-all", isOpen && "opacity-0")} />
            <div className={cn("h-0.5 w-6 bg-foreground transition-all", isOpen && "-rotate-45 -translate-y-2")} />
          </div>
        </button>
      </div>

      {/* Fullscreen Overlay */}
      <div className={cn(
        "fixed inset-0 bg-background z-[101] transition-transform duration-500 ease-in-out transform",
        isOpen ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-16">
            <div className="w-32">
              {logo}
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 text-3xl font-light"
            >
              &times;
            </button>
          </div>

          <nav className="flex flex-col space-y-6">
            {items.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-3xl font-black uppercase tracking-tighter transition-all hover:pl-4",
                  pathname === item.href ? "text-foreground" : "text-foreground/40"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-10 border-t-2 border-foreground/10">
            {footer}
          </div>
        </div>
      </div>
    </div>
  )
}
