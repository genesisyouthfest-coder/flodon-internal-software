import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import ClickableRow from '@/components/ClickableRow'

export const metadata: Metadata = {
  title: 'My Clients',
}

export default async function MyClientsPage(props: {
  searchParams: Promise<{ q?: string; stage?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('added_by', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-foreground">
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">Revenue & Portfolio</p>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase">My Clients</h1>
        </div>
        <Link href="/dashboard/sales/clients/add" className="btn-solid">
          + Add Entity
        </Link>
      </div>

      <div className="border-2 border-foreground bg-card overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px] md:min-w-0">
          <thead className="bg-foreground text-background">
            <tr>
              <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Entity</th>
              <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Contact</th>
              <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-foreground">
            {clients?.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-sm font-bold uppercase tracking-widest text-foreground/50">
                  No active entities found.
                </td>
              </tr>
            ) : (
              clients?.map((client) => (
                <ClickableRow key={client.id} href={`/dashboard/sales/clients/${client.id}`} className="hover:bg-foreground hover:text-background transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold uppercase tracking-wide group-hover:text-background">{client.name}</p>
                    <p className="text-xs text-foreground/60 font-semibold tracking-wider uppercase mt-1 group-hover:text-background/80">{client.brand_name || 'Individual'}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {client.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-2 border-foreground group-hover:border-background">
                      {client.pipeline_stage}
                    </span>
                  </td>
                </ClickableRow>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
