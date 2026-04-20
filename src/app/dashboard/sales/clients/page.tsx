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
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border/50">
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Revenue & Portfolio</p>
          <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">My Clients</h1>
          <p className="text-muted-foreground text-sm font-medium">Synchronizing your active network and deal flow.</p>
        </div>
        <AddClientModal />
      </div>

      <ClientsTable initialClients={clients || []} />
    </div>
  )
}
