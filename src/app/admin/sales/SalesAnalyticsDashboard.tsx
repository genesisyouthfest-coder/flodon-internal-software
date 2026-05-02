'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { deployTask } from './actions'
import { toast } from 'sonner'

export default function SalesAnalyticsDashboard({ 
  initialAgents, 
  initialClients, 
  initialTasks 
}: { 
  initialAgents: any[], 
  initialClients: any[], 
  initialTasks: any[] 
}) {
  const [deploying, setDeploying] = useState(false)
  const [agents, setAgents] = useState(initialAgents)
  const [clients, setClients] = useState(initialClients)
  const [tasks, setTasks] = useState(initialTasks)
  const [selectedTime, setSelectedTime] = useState('28')
  const [selectedAgent, setSelectedAgent] = useState('all')
  const [taskDateFilter, setTaskDateFilter] = useState('1')
  const [taskData, setTaskData] = useState({ agentId: '', objective: '', deadline: '' })

  const supabase = createClient()

  // Filter clients by time (Mock logic for demo)
  const filteredClients = clients.filter(c => true)

  // Aggregate Funnel Stats
  const stages = { lead: 0, contacted: 0, demonstration: 0, proposal: 0, negotiation: 0, won: 0, lost: 0 }
  filteredClients.forEach(c => {
    if (c.pipeline_stage in stages) stages[c.pipeline_stage as keyof typeof stages]++
  })

  // Selected Agent Stats for Graph
  const agentStats = { lead: 0, contacted: 0, demonstration: 0, proposal: 0, negotiation: 0, won: 0, lost: 0 }
  filteredClients.filter(c => selectedAgent === 'all' || c.added_by === selectedAgent).forEach(c => {
    if (c.pipeline_stage in agentStats) agentStats[c.pipeline_stage as keyof typeof agentStats]++
  })

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-foreground">
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">Vertical Intelligence</p>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase">Sales Analytics</h1>
        </div>
      </div>

      {/* Global Funnel */}
      <section className="space-y-6">
         <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-2">Global Pipeline Funnel</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(stages).map(([stage, count]) => (
              <div key={stage} className={`card-solid p-6 flex flex-col justify-between h-32 ${stage === 'won' ? 'bg-foreground text-background' : ''}`}>
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{stage}</p>
                 <p className="text-4xl font-black">{count}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Leads Table with Time Selector */}
      <section className="space-y-6">
         <div className="flex items-end justify-between border-b-2 border-foreground pb-2">
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Operational Lead Log</h2>
            <select 
              value={selectedTime} 
              onChange={(e) => setSelectedTime(e.target.value)}
              className="bg-background text-[10px] font-black uppercase tracking-widest border-2 border-foreground px-3 py-1 focus:outline-none"
            >
               <option value="7">Last 7 Days</option>
               <option value="28">Last 28 Days</option>
               <option value="90">Last 90 Days</option>
               <option value="all">All Time</option>
            </select>
         </div>
         <div className="border-2 border-foreground bg-card overflow-hidden">
            <table className="w-full text-left text-xs uppercase font-bold">
               <thead className="bg-foreground text-background">
                  <tr>
                     <th className="px-6 py-4 tracking-widest">Entity Name</th>
                     <th className="px-6 py-4 tracking-widest">Brand</th>
                     <th className="px-6 py-4 tracking-widest">Pipeline Stage</th>
                     <th className="px-6 py-4 tracking-widest">Captured By</th>
                  </tr>
               </thead>
               <tbody className="divide-y-2 divide-foreground">
                  {filteredClients.slice(0, 5).map(c => (
                    <tr key={c.id}>
                       <td className="px-6 py-4">{c.name}</td>
                       <td className="px-6 py-4 italic opacity-60">{c.brand_name || 'N/A'}</td>
                       <td className="px-6 py-4">
                          <span className="px-2 py-1 border border-foreground">{c.pipeline_stage}</span>
                       </td>
                       <td className="px-6 py-4">{c.profiles?.full_name || 'System'}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      {/* Agent Performance Graph */}
      <section className="space-y-6">
         <div className="flex items-end justify-between border-b-2 border-foreground pb-2">
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Agent Status Telemetry</h2>
            <select 
              value={selectedAgent} 
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="bg-background text-[10px] font-black uppercase tracking-widest border-2 border-foreground px-3 py-1 focus:outline-none"
            >
               <option value="all">All Agents</option>
               {agents.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
            </select>
         </div>
         
         <div className="card-solid p-10 h-64 flex items-end justify-around gap-4 border-b-8">
            {Object.entries(agentStats).map(([stage, count]) => {
              const max = Math.max(...Object.values(agentStats), 1)
              const height = (count / max) * 100
              return (
                <div key={stage} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                   <div className="w-full bg-foreground relative" style={{ height: `${height}%` }}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                         {count}
                      </div>
                   </div>
                   <p className="text-[8px] font-black uppercase tracking-tighter opacity-40 rotate-45 md:rotate-0">{stage}</p>
                </div>
              )
            })}
         </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-6">
         {/* Task Deployment */}
         <section className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-2">Task Deployment</h2>
            <div className="card-solid p-8 space-y-8">
               <form 
                 onSubmit={async (e: React.FormEvent) => {
                   e.preventDefault()
                   if (!taskData.agentId || !taskData.objective || !taskData.deadline) {
                     toast.error('Agent, Objective, and Deadline are required')
                     return
                   }
                   setDeploying(true)
                   try {
                     const result = await deployTask(taskData.agentId, taskData.objective, taskData.deadline)
                     if (result.success) {
                       toast.success('Task deployed to agent dashboard')
                       setTaskData({ agentId: '', objective: '', deadline: '' })
                       const { data } = await supabase.from('tasks').select('*, agent:profiles!tasks_agent_id_fkey(full_name)').order('created_at', { ascending: false })
                       setTasks(data || [])
                     } else {
                       toast.error(`Deployment Failed: ${result.error}`)
                     }
                   } catch (err) {
                     toast.error("Critical system error during deployment")
                   } finally {
                     setDeploying(false)
                   }
                 }} 
                 className="space-y-6"
               >
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest">Target Agent</label>
                        <select 
                          className="input-solid appearance-none bg-background"
                          value={taskData.agentId}
                          onChange={(e) => setTaskData({ ...taskData, agentId: e.target.value })}
                        >
                           <option value="">Select Agent...</option>
                           {agents.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest">Objective</label>
                        <textarea 
                          className="input-solid h-24" 
                          placeholder="Description of the requirement..." 
                          value={taskData.objective}
                          onChange={(e) => setTaskData({ ...taskData, objective: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest">Deadline</label>
                        <input 
                          type="date" 
                          className="input-solid h-12 bg-background font-bold px-4" 
                          value={taskData.deadline}
                          onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
                        />
                     </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={deploying}
                    className="btn-solid w-full"
                  >
                    {deploying ? 'Deploying...' : 'Deploy Task'}
                  </button>
               </form>
            </div>
         </section>

         {/* Task Reviewer */}
         <section className="space-y-6">
            <div className="flex items-end justify-between border-b-2 border-foreground pb-2">
               <h2 className="text-sm font-black uppercase tracking-[0.2em]">Task Reviewer</h2>
               <select 
                 value={taskDateFilter} 
                 onChange={(e) => setTaskDateFilter(e.target.value)}
                 className="bg-background text-[10px] font-black uppercase tracking-widest border-2 border-foreground px-3 py-1 focus:outline-none"
               >
                  <option value="1">Last 24 Hours</option>
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
               </select>
            </div>
            <div className="card-solid p-8 space-y-4 max-h-[500px] overflow-auto">
               {tasks.filter(t => {
                  const dayLimit = parseInt(taskDateFilter)
                  const diff = Date.now() - new Date(t.created_at).getTime()
                  return diff < (dayLimit * 24 * 60 * 60 * 1000)
               }).map((task) => (
                  <div key={task.id} className="p-4 border-2 border-foreground/10 hover:border-foreground transition-colors group bg-background">
                     <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2">
                           <p className="text-[11px] font-black uppercase tracking-tight leading-tight">{task.title}</p>
                           <div className="flex flex-wrap gap-x-4 gap-y-1">
                              <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Agent: {task.agent?.full_name || 'System'}</p>
                              {task.deadline && (
                                 <p className="text-[9px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1">
                                    <span className="h-1 w-1 bg-red-500 rounded-full" />
                                    Due: {new Date(task.deadline).toLocaleDateString()}
                                 </p>
                              )}
                           </div>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 border-2 ${task.status === 'completed' ? 'bg-green-500 text-white border-green-500' : 'border-foreground/30 bg-muted/20'}`}>
                           {task.status}
                        </span>
                     </div>
                  </div>
               ))}
               {tasks.length === 0 && (
                  <p className="p-12 text-center text-[10px] font-black uppercase tracking-widest opacity-20 italic">No tasks logged in this timeframe.</p>
               )}
            </div>
         </section>
      </div>
    </div>
  )
}
