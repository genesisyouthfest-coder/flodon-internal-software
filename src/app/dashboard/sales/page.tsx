import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function SalesOverviewPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Parallelize fetch quick stats and active tasks for the agent
  const [clientResponse, leadResponse, taskResponse] = await Promise.all([
    supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('added_by', user?.id),
    supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('added_by', user?.id)
      .eq('pipeline_stage', 'lead'),
    supabase
      .from('tasks')
      .select('*, assigned_by_profile:profiles!tasks_assigned_by_fkey(full_name)')
      .eq('agent_id', user?.id)
      .neq('status', 'completed')
      .order('created_at', { ascending: false })
  ])

  const totalClients = clientResponse.count || 0
  const leads = leadResponse.count || 0
  const tasks = taskResponse.data || []

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="space-y-2 pb-6 border-b-2 border-foreground">
        <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">Operations Hub</p>
        <h1 className="text-4xl font-extrabold tracking-tight uppercase">Sales Command Center</h1>
        <p className="text-sm font-semibold tracking-widest text-foreground/80 mt-2">Departmental Intelligence & Performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Entities', value: totalClients || 0, sub: 'Active Records' },
          { label: 'Unprocessed Leads', value: leads || 0, sub: 'Immediate Action' },
          { label: 'Active Tasks', value: tasks?.length || 0, sub: 'Strategic Objectives' },
        ].map((stat) => (
          <div key={stat.label} className="card-solid p-6 md:p-8 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{stat.label}</p>
            <p className="text-3xl md:text-5xl font-black">{stat.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 pt-2">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-6">
         {/* Task Queue */}
         <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-foreground pb-2">
               <h2 className="text-sm font-black uppercase tracking-[0.2em]">Task Force Queue</h2>
               <span className="text-[10px] font-black bg-foreground text-background px-2 py-0.5">Priority: Active</span>
            </div>
            <div className="space-y-4">
               {tasks && tasks.length > 0 ? (
                  tasks.map((task: any) => (
                    <div key={task.id} className="card-solid p-6 space-y-4 border-l-8 border-l-foreground">
                       <div className="flex justify-between items-start">
                          <div className="space-y-1">
                             <p className="text-xs font-black uppercase tracking-tight">{task.title}</p>
                             <p className="text-[10px] font-medium opacity-60 leading-relaxed italic">{task.description}</p>
                             {task.deadline && (
                                <p className="text-[9px] font-black uppercase tracking-widest text-red-500 pt-1">
                                   Due: {new Date(task.deadline).toLocaleDateString()}
                                </p>
                             )}
                          </div>
                          <p className="text-[9px] font-black uppercase opacity-40">From: {task.assigned_by_profile?.full_name || 'Admin'}</p>
                       </div>
                       <div className="flex gap-2 pt-2">
                          <form action={async () => {
                             'use server'
                             const { updateTaskStatus } = await import('../../admin/sales/actions')
                             await updateTaskStatus(task.id, 'completed')
                          }}>
                             <button type="submit" className="text-[9px] font-black uppercase tracking-widest border-2 border-foreground px-4 py-1.5 hover:bg-foreground hover:text-background transition-colors">
                                Mark Completed
                             </button>
                          </form>
                       </div>
                    </div>
                  ))
               ) : (
                  <div className="p-12 border-2 border-dashed border-foreground/30 flex flex-col items-center justify-center text-center space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-40">No pending objectives</p>
                     <p className="text-[9px] font-medium italic opacity-30 italic">Strategic silence detected.</p>
                  </div>
               )}
            </div>
         </section>

         {/* Workflows */}
         <section className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-2">Primary Workflows</h2>
            <div className="grid grid-cols-1 gap-4">
               <Link href="/dashboard/sales/clients" className="flex items-center justify-between p-6 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors group">
                  <div className="space-y-1">
                     <p className="text-lg font-bold uppercase tracking-tight">Client Directory</p>
                     <p className="text-[10px] font-medium opacity-60">Manage your persona database.</p>
                  </div>
                  <span className="text-xl group-hover:translate-x-2 transition-transform">&rarr;</span>
               </Link>
               
               <Link href="/dashboard/sales/clients/add" className="flex items-center justify-between p-6 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors group">
                  <div className="space-y-1">
                     <p className="text-lg font-bold uppercase tracking-tight">Onboard New Entity</p>
                     <p className="text-[10px] font-medium opacity-60">Initialize client records.</p>
                  </div>
                  <span className="text-xl group-hover:translate-x-2 transition-transform">&rarr;</span>
               </Link>
            </div>
         </section>
      </div>
    </div>
  )
}
