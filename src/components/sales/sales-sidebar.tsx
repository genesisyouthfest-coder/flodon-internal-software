'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Mail, BarChart3, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/logout-action'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard/sales', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/sales/clients', label: 'My Clients', icon: Users, exact: false },
  { href: '/dashboard/sales/email-settings', label: 'Email Settings', icon: Mail, exact: false },
  { href: '/dashboard/sales/analytics', label: 'Analytics', icon: BarChart3, exact: false },
]

export function SalesSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen w-72 flex-col bg-card text-foreground selection:bg-white selection:text-black border-r border-border/50">
      <div className="flex h-24 shrink-0 items-center px-8 border-b border-border/50">
        <span className="text-xl font-black tracking-tighter uppercase leading-none">
          Flodon <br/> 
          <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">Sales Console</span>
        </span>
      </div>
      
      <div className="flex-1 overflow-auto py-10 px-4 space-y-8">
        <div>
           <p className="px-4 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-4">Navigation</p>
           <nav className="space-y-1">
             {navItems.map((item) => {
               const active = isActive(item.href, item.exact)
               return (
                 <Link
                   key={item.href}
                   href={item.href}
                   className={cn(
                     'flex items-center gap-3 rounded-md px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 ease-in-out group',
                     active
                       ? 'bg-secondary text-foreground'
                       : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                   )}
                 >
                   <item.icon className={cn('h-4 w-4 transition-colors', active ? 'text-foreground' : 'group-hover:text-foreground')} />
                   {item.label}
                   {active && <span className="ml-auto w-1 h-4 rounded-full bg-foreground" />}
                 </Link>
               )
             })}
           </nav>
        </div>
      </div>

      <div className="p-6 border-t border-border/50">
        <form action={logout}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-md h-12 text-[13px] font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive group"
            type="submit"
          >
            <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  )
}
