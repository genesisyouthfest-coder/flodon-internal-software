'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Building2, 
  LogOut, 
  LayoutDashboard, 
  TrendingUp, 
  Megaphone, 
  Settings2, 
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { logout } from '@/app/logout-action'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

interface TopNavProps {
  user: {
    email: string
    name: string
  }
  departments: string[]
  currentDepartment?: string
}

const departmentIcons: Record<string, any> = {
  sales: TrendingUp,
  marketing: Megaphone,
  operations: Settings2,
}

export function TopNav({ user, departments, currentDepartment }: TopNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [unreadCount] = useState(3)

  const handleLogout = async () => {
    await logout()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const handleDepartmentSwitch = (dept: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_department', dept)
    }
    router.push(`/dashboard/${dept.toLowerCase()}`)
  }

  const activeDepartment = currentDepartment || pathname.split('/')[2]

  return (
    <header className="flex h-14 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 font-semibold group cursor-pointer" onClick={() => router.push('/dashboard')}>
          <div className="h-8 w-8 bg-white flex items-center justify-center rounded-md text-black font-black text-lg shadow-2xl">
            F
          </div>
          <span className="hidden md:inline-block text-sm font-black tracking-[0.2em] uppercase">Flodon</span>
          {activeDepartment && (
            <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-[0.2em]">
              {activeDepartment}
            </Badge>
          )}
        </div>
        
        {departments.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 gap-2 text-muted-foreground hover:text-foreground">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">Switch Module</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="text-xs uppercase tracking-widest opacity-50">Departments</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {departments.map((dept) => {
                const Icon = departmentIcons[dept] || LayoutDashboard
                const isActive = activeDepartment === dept
                return (
                  <DropdownMenuItem
                    key={dept}
                    className={cn(
                      "capitalize cursor-pointer gap-2 text-xs font-semibold",
                      isActive && "bg-muted text-primary"
                    )}
                    onClick={() => handleDepartmentSwitch(dept)}
                  >
                    <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    {dept}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex justify-between items-center text-xs uppercase tracking-widest opacity-50">
              Recent Activity
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <div className="p-4 flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-tight">New Client Added</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">John Doe joined the portfolio.</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-[10px] uppercase font-bold tracking-widest text-primary cursor-pointer">
              Open Activity Feed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-offset-background transition-shadow hover:ring-2 hover:ring-border">
              <Avatar className="h-9 w-9 border border-border/50">
                <AvatarFallback className="text-[10px] font-bold">{getInitials(user.name || user.email)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none tracking-tight">{user.name || 'Account Manager'}</p>
                <p className="text-[10px] leading-none text-muted-foreground uppercase tracking-widest mt-1">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 px-4 py-2" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
