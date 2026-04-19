'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { useEffect, useState } from 'react'

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
  const [unreadCount, setUnreadCount] = useState(3) // Mock count for now

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
    router.push(`/dashboard/${dept}`)
  }

  const activeDepartment = currentDepartment || pathname.split('/')[2]

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 font-semibold">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold shrink-0">
            F
          </div>
          <span className="hidden md:inline-block">Flodon CRM</span>
          {activeDepartment && (
            <span className="text-muted-foreground ml-2 capitalize font-normal">
              / {activeDepartment}
            </span>
          )}
        </div>
        
        {departments.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-4 h-9 gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Switch Module</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Departments</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {departments.map((dept) => {
                const Icon = departmentIcons[dept] || LayoutDashboard
                const isActive = activeDepartment === dept
                return (
                  <DropdownMenuItem
                    key={dept}
                    className={cn(
                      "capitalize cursor-pointer gap-2",
                      isActive && "bg-muted font-medium"
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
        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Recent Activity</span>
              <span className="text-xs font-normal text-muted-foreground">{unreadCount} New</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <div className="p-4 flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New Client Added</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">John Doe was added to the Sales pipeline by you.</p>
                  <p className="text-[10px] text-muted-foreground mt-1">2 mins ago</p>
                </div>
              </div>
              <div className="p-4 flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer border-t">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Megaphone className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Welcome Email Sent</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">The welcome email to jane@example.com was delivered successfully.</p>
                  <p className="text-[10px] text-muted-foreground mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="p-4 flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer border-t">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email Failed</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">Failed to send follow-up to support@domain.com due to SMTP error.</p>
                  <p className="text-[10px] text-muted-foreground mt-1">3 hours ago</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-xs text-primary font-medium cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
