import { createAdminClient } from '@/utils/supabase/admin'
import { AdminClientsTable } from '@/components/admin/AdminClientsTable'

export default async function AdminClientsPage() {
  const adminClient = createAdminClient()

  // Fetch all clients with owner profile info
  const { data: clients } = await adminClient
    .from('clients')
    .select(`
      *,
      profiles!clients_added_by_fkey (
        id,
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  // Fetch all active employees for the reassignment list
  const { data: employees } = await adminClient
    .from('profiles')
    .select('id, full_name')
    .order('full_name')

  return (
    <div className="space-y-12">
      <div className="pb-4 border-b border-border/50">
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Global Database</p>
          <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">System Clients</h1>
          <p className="text-muted-foreground text-sm font-medium">Global view of all CRM clients across all employees.</p>
        </div>
      </div>

      <AdminClientsTable 
        clients={clients || []} 
        employees={employees || []} 
      />
    </div>
  )
}
