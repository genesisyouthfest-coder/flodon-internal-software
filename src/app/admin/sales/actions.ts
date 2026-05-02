'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deployTask(agentId: string, objective: string, deadline: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('tasks').insert([{
    agent_id: agentId,
    title: objective.length > 50 ? objective.slice(0, 47) + '...' : objective,
    description: objective,
    assigned_by: user.id,
    status: 'todo',
    priority: 'medium',
    deadline: deadline
  }])

   if (error) {
    console.error("TASK DEPLOY ERROR:", error)
    return { error: error.message }
  }

  console.log("Task deployed successfully to agent:", agentId)
  revalidatePath('/dashboard/sales')
  revalidatePath('/admin/sales')
  return { success: true }
}

export async function updateTaskStatus(taskId: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/sales')
  return { success: true }
}
