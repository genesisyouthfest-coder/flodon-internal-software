import Link from 'next/link'
import { Suspense } from 'react'
import SidebarProfile, { SidebarProfileSkeleton } from './SidebarProfile'
import { MobileNav } from '@/components/MobileNav'

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { label: 'Dashboard', href: '/dashboard/sales' },
    { label: 'Comm Link', href: '/dashboard/sales/email' },
    { label: 'Database', href: '/dashboard/sales/clients' },
  ]

  const logo = <img src="/icon_with_text.svg" alt="Flodon" className="logo-img" />

  return (
    <div className="flex h-screen bg-background overflow-hidden flex-col lg:flex-row">
      <MobileNav 
        items={navItems} 
        logo={logo}
        footer={
          <div className="flex items-center justify-between">
            <Suspense fallback={<SidebarProfileSkeleton />}>
              <SidebarProfile />
            </Suspense>
          </div>
        }
      />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r-2 border-foreground bg-background flex-col justify-between animate-in slide-in-from-left duration-500 overflow-y-auto">
        <div className="p-8 space-y-10">
          <div className="mb-14">
            <Link href="/dashboard/sales" className="block mb-2">
              <img src="/icon_with_text.svg" alt="Flodon" className="logo-img" />
            </Link>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/40 text-center">Sales Module</p>
          </div>
          
          <nav className="flex flex-col space-y-4">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background border-2 border-transparent hover:border-foreground px-4 py-3 transition-colors">
                {item.label}
                <span className="text-xs">&rarr;</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-8 border-t-2 border-foreground flex items-center justify-between group">
          <Suspense fallback={<SidebarProfileSkeleton />}>
            <SidebarProfile />
          </Suspense>
          <form action={async () => {
            'use server'
            const { logout } = await import('../../login/actions')
            await logout()
          }}>
             <button type="submit" className="p-2 hover:bg-red-500 hover:text-background transition-colors border-2 border-transparent hover:border-foreground group/btn" title="Exit Pit Lane (Logout)">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square" className="transform -skew-x-12">
                  <path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5" />
                  <polyline points="15 17 20 12 15 7" />
                  <line x1="20" y1="12" x2="9" y2="12" />
                </svg>
             </button>
          </form>
        </div>
      </aside>
      
      <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-16 pt-24 lg:pt-16">
        <div className="max-w-6xl w-full mx-auto animate-in fade-in duration-700">
          {children}
        </div>
      </main>
    </div>
  )
}
