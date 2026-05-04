import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inbound Leads | Admin',
}

export default async function InboundLeadsPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from('clients')
    .select('*')
    .eq('lead_source', 'website')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-foreground">
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">Direct Traffic</p>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase">Inbound Leads</h1>
          <p className="text-sm font-semibold tracking-widest text-foreground/80 mt-2">Qualified Website Conversions.</p>
        </div>
      </div>

      {!leads || leads.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-foreground/20">
          <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-40">No website leads detected in system grid.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {leads.map((lead) => {
            const date = new Date(lead.created_at).toLocaleDateString('en-IN', {
               day: '2-digit',
               month: 'short',
               year: 'numeric'
            })

            return (
              <div key={lead.id} className="card-solid p-0 flex flex-col group hover:border-foreground transition-all duration-300">
                <div className="p-6 flex-1 flex flex-col space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h2 className="text-xl font-black uppercase tracking-tighter leading-tight">{lead.name}</h2>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{lead.brand_name || 'Individual Entity'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-tight">
                      <span className="opacity-40 uppercase text-[9px] w-12">Email:</span>
                      <span className="truncate">{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-xs font-bold tracking-tight">
                        <span className="opacity-40 uppercase text-[9px] w-12">Phone:</span>
                        <span>{lead.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Qualification Brief */}
                  <div className="bg-foreground/5 p-4 space-y-4 border-l-2 border-foreground">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Intel Brief</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[8px] font-bold uppercase opacity-50 mb-1">Revenue</p>
                        <p className="text-[10px] font-black uppercase">{q.monthlyRevenue || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold uppercase opacity-50 mb-1">Investment</p>
                        <p className="text-[10px] font-black uppercase">{q.investmentLevel || 'Unknown'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[8px] font-bold uppercase opacity-50 mb-1">Bottleneck</p>
                        <p className="text-[10px] font-bold uppercase leading-tight">{q.biggestBottleneck || 'No bottleneck specified'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto flex items-center justify-between border-t border-foreground/10">
                    <p className="text-[10px] font-bold opacity-40 uppercase">{date}</p>
                    <Link 
                      href={`/admin/clients/${lead.id}`}
                      className="text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
