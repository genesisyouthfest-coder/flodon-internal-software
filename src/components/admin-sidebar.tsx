'use client'

import Link from 'next/link'
import { LayoutDashboard, Users, Activity, Settings, LogOut, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/employees', label: 'Employees', icon: Users },
  { href: '/admin/clients', label: 'Clients', icon: Briefcase },
  { href: '/admin/audit', label: 'Audit Log', icon: Activity },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  return (
    <div className="flex h-screen w-72 flex-col bg-card text-foreground selection:bg-white selection:text-black">
      <div className="flex h-24 shrink-0 items-center px-8 border-b border-border/50">
        <span className="text-xl font-black tracking-tighter uppercase leading-none">Flodon <br/> <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground">Admin</span></span>
      </div>
      
      <div className="flex-1 overflow-auto py-10 px-4 space-y-8">
        <div>
           <p className="px-4 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-4">Navigation</p>
           <nav className="space-y-1">
             {navItems.map((item) => (
               <Link
                 key={item.href}
                 href={item.href}
                 className="flex items-center gap-3 rounded-md px-4 py-2.5 text-[13px] font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150 ease-in-out group"
               >
                 <item.icon className="h-4 w-4 group-hover:text-foreground transition-colors" />
                 {item.label}
               </Link>
             ))}
           </nav>
        </div>
      </div>

      <div className="p-6 border-t border-border/50">
        <form action="/auth/logout" method="post">
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-md h-12 text-[13px] font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive group" type="submit">
            <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  )
}
