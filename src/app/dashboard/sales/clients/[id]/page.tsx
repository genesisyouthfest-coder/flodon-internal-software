import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ClientDetailView } from '@/components/sales/client-detail-view'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch client data
  const { data: client } = await supabase
    .from('clients')
    .select(`
      *,
      profiles!clients_added_by_fkey (
        id,
        full_name,
        email
      )
    `)
    .eq('id', id)
    .single()

  if (!client) {
    notFound()
  }

  // Fetch activities for this client
  const { data: activities } = await supabase
    .from('activity_log')
    .select('*')
    .eq('entity_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/dashboard/sales/clients">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Client Details</h1>
          <p className="text-sm text-muted-foreground">Detailed view and management for {client.name}.</p>
        </div>
      </div>

      <ClientDetailView client={client} activities={activities || []} />
    </div>
  )
}
