import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Mail, TrendingUp, CheckCircle } from 'lucide-react'
import { AddClientModal } from '@/components/sales/add-client-modal'
import { Metadata } from 'next'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Sales Dashboard',
}

export default async function SalesDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get current user's clients
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('added_by', user.id)
    .order('created_at', { ascending: false })

  const allClients = clients || []
  
  // Calculate stats
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const clientsThisMonth = allClients.filter(c => new Date(c.created_at) >= currentMonthStart).length
  const emailsSent = allClients.filter(c => c.email_sent).length
  const openLeads = allClients.filter(c => ['lead', 'contacted', 'proposal'].includes(c.pipeline_stage)).length
  const closedWon = allClients.filter(c => c.pipeline_stage === 'closed_won').length

  const recentClients = allClients.slice(0, 10)

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border/50">
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Revenue & Pipeline</p>
          <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">Sales Dashboard</h1>
          <p className="text-muted-foreground text-sm font-medium">Orchestrating growth and pipeline synchronization.</p>
        </div>
        <AddClientModal />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Clients', sub: 'Current Month', value: clientsThisMonth, icon: Users },
          { label: 'Emails Delivered', sub: 'System Tracker', value: emailsSent, icon: Mail },
          { label: 'Open Opportunities', sub: 'Active Pipeline', value: openLeads, icon: TrendingUp },
          { label: 'Completed Sales', sub: 'Closed Won', value: closedWon, icon: CheckCircle },
        ].map((stat) => (
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

      <Card className="bg-card border-border/50">
        <CardHeader className="pb-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Recent Opportunities</CardTitle>
              <CardDescription className="text-xs uppercase tracking-wider font-semibold opacity-60">Latest leads added to your network</CardDescription>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">Lead Name</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">Company</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">Service</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center">Stage</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right pr-6">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-secondary/50 to-secondary border border-border/50 flex items-center justify-center shadow-inner">
                          <Users className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                        <div className="space-y-2 max-w-[280px]">
                          <p className="text-lg font-bold tracking-tight">Your Pipeline is Quiet</p>
                          <p className="text-xs text-muted-foreground/60 leading-relaxed">No clients found in your portfolio yet. Add your first client to start tracking metrics and automated outreach.</p>
                        </div>
                        <AddClientModal />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentClients.map(client => (
                    <TableRow key={client.id} className="hover:bg-muted/50 border-border/50 transition-colors">
                      <TableCell className="py-4">
                        <Link href={`/dashboard/sales/clients/${client.id}`} className="font-bold text-sm tracking-tight hover:underline">
                          {client.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-muted-foreground">{client.brand_name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-bold px-2 py-0">
                          {client.service?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={
                            client.pipeline_stage === 'closed_won' ? 'default' :
                            client.pipeline_stage === 'closed_lost' ? 'destructive' : 'secondary'
                          }
                          className="capitalize text-[10px] font-bold"
                        >
                          {client.pipeline_stage?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground font-mono text-[11px] pr-6">
                        {format(new Date(client.created_at), 'MMM d')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
