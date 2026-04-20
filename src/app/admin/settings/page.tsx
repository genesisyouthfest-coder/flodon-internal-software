import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Metadata } from 'next'
import { Shield, Mail, Database, Globe, Key, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Settings',
}

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  // Fetch system info
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  const { count: totalLogs } = await supabase
    .from('activity_log')
    .select('*', { count: 'exact', head: true })

  const systemInfo = [
    { label: 'Total Employees', value: totalUsers ?? 0, icon: Shield },
    { label: 'Total Clients', value: totalClients ?? 0, icon: Database },
    { label: 'Activity Log Entries', value: totalLogs ?? 0, icon: Globe },
  ]

  const envChecks = [
    { label: 'NEXT_PUBLIC_SUPABASE_URL', set: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
    { label: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    { label: 'SUPABASE_SERVICE_ROLE_KEY', set: !!process.env.SUPABASE_SERVICE_ROLE_KEY },
    { label: 'RESEND_API_KEY', set: !!process.env.RESEND_API_KEY },
  ]

  return (
    <div className="space-y-12 max-w-5xl">
      <div className="pb-4 border-b border-border/50">
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Configuration</p>
          <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">Settings</h1>
          <p className="text-muted-foreground text-sm font-medium">System configuration and environment overview.</p>
        </div>
      </div>

      {/* System Stats */}
      <div className="space-y-4">
        <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">System Overview</p>
        <div className="grid gap-4 md:grid-cols-3">
          {systemInfo.map((item) => (
            <Card key={item.label} className="bg-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {item.label}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tighter">{item.value.toLocaleString()}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Environment Variables Check */}
      <div className="space-y-4">
        <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Environment Configuration</p>
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Key className="h-4 w-4" />
              Environment Variables
            </CardTitle>
            <CardDescription>
              Required environment variables for the application to function correctly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {envChecks.map((env) => (
                <div key={env.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <span className="font-mono text-[12px] text-muted-foreground">{env.label}</span>
                  {env.set ? (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] uppercase tracking-wider font-bold">
                      Configured
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[10px] uppercase tracking-wider font-bold">
                      Missing
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Account */}
      <div className="space-y-4">
        <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Admin Account</p>
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin Authentication
            </CardTitle>
            <CardDescription>
              The admin account is restricted to a single hard-coded email address for maximum security.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Admin Email</span>
              <span className="font-mono text-sm font-bold">admin@flodon.in</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Authentication Method</span>
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">Supabase Auth</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Access Control</span>
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">Email-Based Guard</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email System */}
      <div className="space-y-4">
        <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Email System</p>
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Transactional Email
            </CardTitle>
            <CardDescription>
              Welcome emails and notifications are sent via Resend. Employees can configure custom SMTP in their Email Settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Default Provider</span>
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">Resend</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Default Sender</span>
              <span className="font-mono text-sm">team@flodon.in</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Custom SMTP</span>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">Per-Employee</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="flex items-start gap-3 pt-6">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-amber-400">Production Notice</p>
            <p className="text-xs text-muted-foreground">
              The <code className="bg-secondary px-1 py-0.5 rounded text-[11px]">SUPABASE_SERVICE_ROLE_KEY</code> grants full database access bypassing RLS. 
              Ensure it is never exposed to the client and is only used in server-side admin routes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
