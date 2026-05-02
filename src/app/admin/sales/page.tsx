import { createClient } from '@/utils/supabase/server'
import SalesAnalyticsDashboard from './SalesAnalyticsDashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sales Intelligence',
}

export default async function AdminSalesIntelPage() {
  const supabase = await createClient()

  // Parallelize server-side data fetching for instant response
  const [profileResponse, clientResponse, taskResponse] = await Promise.all([
    supabase.from('profiles').select('*').order('full_name'),
    supabase.from('clients').select('*, profiles!clients_added_by_fkey(full_name)'),
    supabase.from('tasks').select('*, agent:profiles!tasks_agent_id_fkey(full_name)').order('created_at', { ascending: false })
  ])

  return (
    <SalesAnalyticsDashboard 
      initialAgents={profileResponse.data || []}
      initialClients={clientResponse.data || []}
      initialTasks={taskResponse.data || []}
    />
  )
}
