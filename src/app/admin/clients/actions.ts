'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function reassignClient(clientId: string, employeeId: string) {
  const adminClient = createAdminClient()

  const { error } = await adminClient
    .from('clients')
    .update({ added_by: employeeId })
    .eq('id', clientId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/clients')
  return { success: true }
}
