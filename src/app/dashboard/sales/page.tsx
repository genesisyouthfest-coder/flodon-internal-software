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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
          <p className="text-muted-foreground">Overview of your sales activity and pipeline.</p>
        </div>
        <div className="w-full sm:w-auto">
          <AddClientModal />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">My Clients This Month</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientsThisMonth}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailsSent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Open Leads</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openLeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closedWon}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Clients */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Clients</CardTitle>
            <CardDescription>The final 10 clients added by you.</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/sales/clients">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">No clients yet</p>
                          <p className="text-sm text-muted-foreground">Add your first client to start tracking your pipeline.</p>
                        </div>
                        <AddClientModal />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentClients.map(client => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/sales/clients/${client.id}`} className="hover:underline">
                          {client.name}
                        </Link>
                      </TableCell>
                      <TableCell>{client.brand_name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{client.service}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            client.pipeline_stage === 'closed_won' ? 'default' :
                            client.pipeline_stage === 'closed_lost' ? 'destructive' : 'secondary'
                          }
                          className="capitalize"
                        >
                          {client.pipeline_stage?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(client.created_at), 'MMM d, yyyy')}
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
