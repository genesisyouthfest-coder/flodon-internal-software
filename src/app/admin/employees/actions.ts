'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addEmployee(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user: adminUser },
  } = await supabase.auth.getUser()

  if (!adminUser || adminUser.email !== 'admin@flodon.in') {
    throw new Error('Unauthorized: Admin access required.')
  }

  // Use Admin Client to bypass RLS if Key is available
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!adminKey) {
    return { error: 'SUPABASE_SERVICE_ROLE_KEY is missing in your .env.local. Please add it to enable administrative onboarding.' }
  }

  const adminClient = createAdminClient()
  
  const email = formData.get('email') as string
  const fullName = formData.get('full_name') as string
  const deptInput = formData.get('departments') as string
  const departments = deptInput ? deptInput.split(',').map(d => d.trim()) : []

  // Create the actual Auth User first to satisfy the foreign key constraint
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password: 'Flodon@2026', 
    email_confirm: true,
    user_metadata: { full_name: fullName }
  })

  if (authError) return { error: `Auth Creation Error: ${authError.message}` }

  // Now create the profile with the valid Auth ID
  const { error: profileError } = await adminClient.from('profiles').insert([{
    id: authData.user.id,
    email,
    full_name: fullName,
    departments,
    is_admin: false
  }])

  if (profileError) return { error: `Profile Creation Error: ${profileError.message}` }

  revalidatePath('/admin/employees')
  redirect('/admin/employees')
}

export async function updateUserPassword(userId: string, newPassword: string) {
  const adminClient = createAdminClient()
  
  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    password: newPassword
  })

  if (error) return { error: error.message }
  
  return { success: true }
}

export async function deleteEmployee(userId: string) {
  const adminClient = createAdminClient()
  
  // 1. Delete from profiles (Foreign key restricted, usually delete profile first if cascade not set)
  const { error: profileError } = await adminClient
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (profileError) return { error: profileError.message }

  // 2. Delete from Auth
  const { error: authError } = await adminClient.auth.admin.deleteUser(userId)

  if (authError) return { error: authError.message }

  revalidatePath('/admin/employees')
  redirect('/admin/employees')
}

export async function toggleEmployeeActive(userId: string, currentStatus: boolean) {
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!adminKey) return { error: 'Missing Service Role Key' }

  const adminClient = createAdminClient()
  const newStatus = !currentStatus
  
  // 1. Update Profile Flag
  const { error: profileError } = await adminClient
    .from('profiles')
    .update({ is_active: newStatus })
    .eq('id', userId)

  if (profileError) return { error: profileError.message }

  // 2. Terminate Auth Session (Ban for 100 years if inactive, or remove ban if active)
  const { error: authError } = await adminClient.auth.admin.updateUserById(userId, {
    ban_duration: newStatus === false ? '876000h' : '0h'
  })

  if (authError) return { error: `Auth Status Error: ${authError.message}` }

  revalidatePath(`/admin/employees/${userId}`)
  revalidatePath('/admin/employees')
  return { success: true }
}





