import { createAdminClient } from '@/utils/supabase/admin'
import { notFound } from 'next/navigation'
import BackButton from '@/components/BackButton'
import { updateClientStage } from '@/app/dashboard/sales/actions' // Reuse the existing action
import NotesEditor from '@/app/dashboard/sales/clients/[id]/NotesEditor'
import DeleteClientButton from '@/app/dashboard/sales/clients/[id]/DeleteClientButton'

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
          <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">Record ID: {client.id.slice(0, 8)}</p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">{client.name}</h1>
            <p className="text-xl font-bold tracking-widest text-foreground/80 uppercase mt-2">{client.brand_name || 'Individual Entity'}</p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Status Alignment</p>
             <div className="inline-flex items-center gap-2 border-2 border-foreground p-2 overflow-x-auto max-w-full no-scrollbar whitespace-nowrap bg-background">
                {['lead', 'contacted', 'demo', 'proposal', 'negotiation', 'won', 'lost'].map((stage) => (
                  <form key={stage} action={async () => {
                    'use server'
                    await updateClientStage(client.id, stage)
                  }}>
                    <button 
                      type="submit"
                      className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] transition-colors border-2 ${client.pipeline_stage === stage ? 'bg-foreground text-background border-foreground' : 'border-transparent hover:border-foreground/30'}`}
                    >
                      {stage}
                    </button>
                  </form>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Notes Section from Sales Dash */}
          <NotesEditor clientId={client.id} initialNotes={client.notes} />

          {/* Qualification Intel (Website Leads Only) */}
          {client.lead_source === 'website' && (
            <section className="space-y-6">
               <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-2">Discovery Brief</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    ['Monthly Revenue', q.monthlyRevenue],
                    ['Investment Level', q.investmentLevel],
                    ['Decision Maker', q.decisionMaker],
                    ['Ready to Move', q.readyToMoveForward],
                    ['Biggest Bottleneck', q.biggestBottleneck],
                    ['Current Lead Sources', q.currentLeadSources],
                    ['Goal (90 Days)', q.goal90Days]
                  ].map(([label, value]) => (
                    <div key={label} className="space-y-1 border-l-2 border-foreground pl-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">{label}</p>
                      <p className="text-sm font-bold uppercase tracking-tight">{value || 'N/A'}</p>
                    </div>
                  ))}
               </div>
               
               {q.businessDescription && (
                 <div className="mt-8 p-6 bg-foreground/5 border-l-2 border-foreground">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Business Narrative</p>
                    <p className="text-sm leading-relaxed">{q.businessDescription}</p>
                 </div>
               )}
            </section>
          )}

          <section className="space-y-6">
             <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-2">Entity Metadata</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {[
                  ['Industry', client.industry],
                  ['Service Module', client.service],
                  ['Role/Persona', client.role],
                  ['Country of Origin', client.country]
                ].map(([label, value]) => (
                  <div key={label} className="space-y-1 border-l-2 border-foreground pl-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">{label}</p>
                    <p className="text-sm font-bold uppercase tracking-tight">{value || 'N/A'}</p>
                  </div>
                ))}
             </div>
          </section>
        </div>

        <div className="space-y-12">
            <section className="space-y-6">
               <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-2">Connect</h2>
               <div className="space-y-4">
                  <div className="card-solid p-6 space-y-4">
                     <div className="space-y-1">
                       <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Direct Email</p>
                       <p className="text-sm font-bold">{client.email}</p>
                     </div>
                     {client.phone && (
                       <div className="space-y-1">
                         <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Phone</p>
                         <p className="text-sm font-bold">{client.phone}</p>
                       </div>
                     )}
                     <div className="space-y-1 border-t border-foreground/10 pt-4">
                       <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Added By</p>
                       <p className="text-sm font-bold uppercase">{client.profiles?.full_name || 'Website Agent'}</p>
                     </div>
                  </div>

                  <div className="flex gap-4">
                    {client.ig_profile && (
                      <a href={client.ig_profile} target="_blank" className="btn-outline flex-1 text-center py-2 text-xs">Instagram</a>
                    )}
                    {client.fb_profile && (
                      <a href={client.fb_profile} target="_blank" className="btn-outline flex-1 text-center py-2 text-xs">Facebook</a>
                    )}
                  </div>
               </div>
            </section>

            <section className="space-y-6">
               <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-2">Engagement Status</h2>
               <div className="card-solid p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Email Sent</p>
                     <span className={`h-2 w-2 rounded-full ${client.email_sent ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  {client.email_sent_at && (
                     <p className="text-xs font-bold uppercase tracking-tighter opacity-70">
                        Dispatched: {new Date(client.email_sent_at).toLocaleDateString()}
                     </p>
                  )}
               </div>
            </section>

            <section className="space-y-6 pt-12 border-t-2 border-foreground/10">
               <h2 className="text-sm font-black uppercase tracking-[0.2em] text-red-500">System Destruction</h2>
               <div className="card-solid p-6 border-red-500/30">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-4 italic">Permanent record deletion cannot be reversed.</p>
                  <DeleteClientButton clientId={client.id} />
               </div>
            </section>
        </div>
      </div>
    </div>
  )
}
