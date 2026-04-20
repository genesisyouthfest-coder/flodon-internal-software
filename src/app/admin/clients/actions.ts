'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function reassignClient(clientId: string, employeeId: string) {
  const adminClient = createAdminClient()

  // Fetch the new employee's name to keep cache aligned
  const { data: profile } = await adminClient
    .from('profiles')
    .select('full_name')
    .eq('id', employeeId)
    .single()

  const { error } = await adminClient
    .from('clients')
    .update({ 
      added_by: employeeId,
      added_by_name: profile?.full_name || 'Reassigned Admin'
    })
    .eq('id', clientId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/clients')
  return { success: true }
}
