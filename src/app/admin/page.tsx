import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle, Users, Briefcase, Mail, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  // 1. Fetch Stats
  const { count: employeeCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: clientCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  // Emails sent this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count: emailCount } = await supabase
    .from('activity_log')
    .select('*', { count: 'exact', head: true })
    .eq('action', 'email_sent')
    .gte('created_at', startOfMonth.toISOString())

  // Active Departments (assuming departments are stored as text[] in profiles)
  const { data: profileDepts } = await supabase
    .from('profiles')
    .select('departments')
  
  const allDepts = new Set<string>()
  profileDepts?.forEach(p => {
    p.departments?.forEach((d: string) => allDepts.add(d))
  })

  // 2. Fetch Recent Activity
  const { data: activities } = await supabase
    .from('activity_log')
    .select(`
      *,
      profiles (
        name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  const stats = [
    { label: 'Total Employees', value: employeeCount || 0, icon: Users },
    { label: 'Total Clients', value: clientCount || 0, icon: Briefcase },
    { label: 'Emails Sent (Month)', value: emailCount || 0, icon: Mail },
    { label: 'Active Departments', value: allDepts.size || 0, icon: Layers },
  ]

  return (
    <div className="space-y-12 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border/50">
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">System Overview</p>
          <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm font-medium">Welcome back, Admin. Real-time operations overview.</p>
        </div>
        <Link href="/admin/employees">
          <Button className="h-11 px-6 text-xs font-bold uppercase tracking-widest rounded-md" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border/50 hover:border-border transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tighter">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-8">
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-wider font-semibold opacity-60">System-wide event stream</CardDescription>
               </div>
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {activities?.length ? (
                activities.map((log) => (
                  <div key={log.id} className="grid grid-cols-[1fr_auto] items-center gap-4 py-4 px-4 hover:bg-secondary/50 transition-colors rounded-lg group">
                    <div className="space-y-1">
                      <p className="text-[13px] font-medium leading-none">
                        <span className="font-bold text-foreground uppercase tracking-tight">{log.profiles?.name || 'System'}</span> 
                        <span className="text-muted-foreground mx-2 lowercase opacity-60">performed</span>
                        <span className="text-xs font-bold uppercase tracking-widest bg-secondary px-2 py-0.5 rounded text-[10px]">{log.action.replace('_', ' ')}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono opacity-40">
                        {log.entity_type} {log.entity_id ? `(#${log.entity_id.slice(0, 8)})` : ''}
                      </p>
                    </div>
                    <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity">
                      {format(new Date(log.created_at), 'HH:mm:ss')} · {format(new Date(log.created_at), 'MMM d')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                   <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">No recent activity found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
