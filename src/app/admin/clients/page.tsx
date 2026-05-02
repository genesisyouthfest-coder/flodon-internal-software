import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'

export default async function AdminClientsPage(props: {
  searchParams: Promise<{ q?: string }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  // 1. Verify Authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Fetch Profile for Admin Check
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.is_admin || user.email === 'admin@flodon.in'
  if (!isAdmin) redirect('/dashboard')

  // 3. Use Admin Client to view all entities across system
  const adminClient = createAdminClient()

  let query = adminClient
    .from('clients')
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (searchParams.q) {
    query = query.or(`name.ilike.%${searchParams.q}%,email.ilike.%${searchParams.q}%,brand_name.ilike.%${searchParams.q}%`)
  }

  const { data: clients } = await query

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2 pb-6 border-b-2 border-foreground">
        <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">Global Database</p>
        <h1 className="text-4xl font-extrabold tracking-tight uppercase">System Clients</h1>
        <p className="text-sm font-semibold tracking-widest text-foreground/80 mt-2">Global View Across All Agents.</p>
      </div>

      <div className="border-2 border-foreground bg-card overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap min-w-[700px] md:min-w-0">
          <thead className="bg-foreground text-background">
            <tr>
              <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Entity</th>
              <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Contact</th>
              <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Added By</th>
              <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-foreground">
            {clients?.length === 0 || !clients ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm font-bold uppercase tracking-widest text-foreground/50">
                  No active entities found globally.
                </td>
              </tr>
            ) : (
              clients.map((client: any) => (
                <tr key={client.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold uppercase tracking-wide">{client.name}</p>
                    <p className="text-xs text-foreground/60 font-semibold tracking-wider uppercase mt-1">
                      {client.brand_name || 'Individual'}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {client.email}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold tracking-tight text-xs uppercase">{client.profiles?.full_name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-2 border-foreground">
                      {client.pipeline_stage}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
