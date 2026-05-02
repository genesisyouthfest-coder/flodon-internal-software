import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalEmployees },
    { count: totalClients },
    { count: totalEmailConnections }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true }).neq('lead_source', 'website'),
    supabase.from('email_connections').select('*', { count: 'exact', head: true })
  ])

  const { data: recentActivity } = await supabase
    .from('activity_log')
    .select(`
      *,
      profiles!activity_log_user_id_fkey ( full_name )
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  // Advanced Analytics
  const { data: clients } = await supabase.from('clients').select('pipeline_stage').neq('lead_source', 'website')
  const wonCount = clients?.filter(c => c.pipeline_stage === 'won').length || 0
  const activeCount = clients?.filter(c => !['won', 'lost'].includes(c.pipeline_stage)).length || 0
  const estimatedRevenue = (wonCount * 12500).toLocaleString()

  return (
    <div className="space-y-12 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-foreground">
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">System Overview</p>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase">Admin Dashboard</h1>
          <p className="text-sm font-semibold tracking-widest text-foreground/80 mt-2">Real-time operations overview.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="card-solid p-6 flex flex-col justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Estimated Revenue</p>
          <h2 className="text-3xl md:text-5xl font-black mt-4">${estimatedRevenue}</h2>
          <div className="h-1 bg-foreground w-full mt-4" />
        </div>
        <div className="card-solid p-6 flex flex-col justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Active Pipeline</p>
          <h2 className="text-3xl md:text-5xl font-black mt-4">{activeCount}</h2>
          <p className="text-[9px] font-bold uppercase tracking-tighter opacity-40 mt-2">Open Opportunities</p>
        </div>
        <div className="card-solid p-6 flex flex-col justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Success Rate (Won)</p>
          <h2 className="text-3xl md:text-5xl font-black mt-4">{wonCount}</h2>
          <p className="text-[9px] font-bold uppercase tracking-tighter opacity-40 mt-2">Validated Conversions</p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tighter uppercase">Recent System Activity</h2>
        <div className="border-2 border-foreground bg-card overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px] md:min-w-0">
            <thead className="bg-foreground text-background">
              <tr>
                <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Timestamp</th>
                <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Action</th>
                <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-foreground">
              {recentActivity?.length === 0 || !recentActivity ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-sm font-bold uppercase tracking-widest text-foreground/50">
                    No recent activity.
                  </td>
                </tr>
              ) : (
                recentActivity.map((log: any) => (
                  <tr key={log.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-foreground/70 tracking-tight">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold tracking-widest text-[10px] uppercase">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 font-bold tracking-widest text-xs uppercase">
                      {log.profiles?.full_name || 'System'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
