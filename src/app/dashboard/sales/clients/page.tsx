import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ClientsTable } from '@/components/sales/clients-table'
import { AddClientModal } from '@/components/sales/add-client-modal'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Clients',
}

export default async function MyClientsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch initial clients for SSR
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('added_by', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Clients</h1>
          <p className="text-muted-foreground">Manage your assigned clients and their pipeline status.</p>
        </div>
        <div className="w-full sm:w-auto">
          <AddClientModal />
        </div>
      </div>

      <ClientsTable initialClients={clients || []} />
    </div>
  )
}
