import { createAdminClient } from '@/utils/supabase/admin'
import { notFound } from 'next/navigation'
import BackButton from '@/components/BackButton'

export default async function AdminClientDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const adminClient = createAdminClient()

  const { data: client } = await adminClient
    .from('clients')
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
    .eq('id', params.id)
    .single()

  if (!client) notFound()

  const q = client.qualification || {}

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-6 pb-6 border-b-2 border-foreground">
        <div className="flex items-center gap-4">
          <BackButton />
          <div className="h-1 w-1 bg-foreground rounded-full" />
          <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">Lead Intelligence</p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">{client.name}</h1>
            <p className="text-xl font-bold tracking-widest text-foreground/80 uppercase mt-2">{client.brand_name || 'Inbound Website Lead'}</p>
          </div>
          
          <div className="border-2 border-foreground p-4 bg-foreground text-background">
             <p className="text-[10px] font-black uppercase tracking-widest">Pipeline Stage</p>
             <p className="text-2xl font-black uppercase">{client.pipeline_stage}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Detailed Intelligence */}
          <section className="space-y-6">
             <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-2">Qualification Intel</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  ['Monthly Revenue', q.monthlyRevenue],
                  ['Investment Level', q.investmentLevel],
                  ['Decision Maker', q.decisionMaker],
                  ['Ready to Move', q.readyToMoveForward],
                  ['Biggest Bottleneck', q.biggestBottleneck],
                  ['Current Lead Sources', q.currentLeadSources],
                  ['Using AI', q.usingAI],
                  ['Goal (90 Days)', q.goal90Days]
                ].map(([label, value]) => (
                  <div key={label} className="space-y-1 border-l-2 border-foreground pl-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">{label}</p>
                    <p className="text-sm font-bold uppercase tracking-tight">{value || 'N/A'}</p>
                  </div>
                ))}
             </div>
          </section>

          <section className="space-y-6">
             <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-2">Business Narrative</h2>
             <div className="card-solid p-6 bg-foreground/5">
                <p className="text-sm leading-relaxed">{q.businessDescription || 'No business description provided.'}</p>
             </div>
          </section>
        </div>

        <div className="space-y-12">
            <section className="space-y-6">
               <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-2">Contact Context</h2>
               <div className="card-solid p-6 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Email</p>
                    <p className="text-sm font-bold">{client.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Phone</p>
                    <p className="text-sm font-bold">{client.phone || 'Not Provided'}</p>
                  </div>
                  <div className="space-y-1 border-t border-foreground/10 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Added By</p>
                    <p className="text-sm font-bold uppercase">{client.profiles?.full_name || 'Website Agent'}</p>
                  </div>
               </div>
            </section>

            {client.notes && (
              <section className="space-y-6">
                 <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-2">System Notes</h2>
                 <div className="card-solid p-6 text-xs italic opacity-70">
                    {client.notes}
                 </div>
              </section>
            )}
        </div>
      </div>
    </div>
  )
}
