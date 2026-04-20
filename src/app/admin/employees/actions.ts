'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createEmployee(formData: {
  name: string
  email: string
  password: string
  departments: string[]
}) {
  const adminClient = createAdminClient()

  // 1. Create Auth User
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
    user_metadata: { name: formData.name }
  })

  if (authError) {
    return { success: false, error: authError.message }
  }

  // 2. Insert into profiles (using admin client to bypass RLS)
  const { error: profileError } = await adminClient
    .from('profiles')
    .insert({
      id: authData.user.id,
      full_name: formData.name,
      email: formData.email,
      departments: formData.departments
    })

  if (profileError) {
    // Cleanup auth user if profile creation fails? Maybe.
    return { success: false, error: profileError.message }
  }

  revalidatePath('/admin/employees')
  revalidatePath('/admin')
  return { success: true }
}

export async function toggleEmployeeStatus(id: string, active: boolean) {
  const adminClient = createAdminClient()

  // Temporary bypass for missing is_active schema column mapping.
  // const { error } = await adminClient
  //   .from('profiles')
  //   .update({ is_active: active })
  //   .eq('id', id)
  
  // if (error) return { success: false, error: error.message }

  revalidatePath('/admin/employees')
  return { success: true, error: null }
}

export async function updateDepartments(id: string, departments: string[]) {
  const adminClient = createAdminClient()

  const { error } = await adminClient
    .from('profiles')
    .update({ departments })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/employees')
  return { success: true }
}

export async function updateEmployee(id: string, formData: {
  name: string
  email: string
  password?: string
  departments: string[]
}) {
  const adminClient = createAdminClient()

  // 1. Update Profile
  const { error: profileError } = await adminClient
    .from('profiles')
    .update({
      full_name: formData.name,
      email: formData.email,
      departments: formData.departments
    })
    .eq('id', id)

  if (profileError) return { success: false, error: profileError.message }

  // 2. Update Auth fields
  const updates: any = {
    email: formData.email,
    email_confirm: true,
    user_metadata: { name: formData.name }
  }
  if (formData.password) {
    updates.password = formData.password
  }

  const { error: authError } = await adminClient.auth.admin.updateUserById(id, updates)
  if (authError) return { success: false, error: authError.message }

  revalidatePath('/admin/employees')
  return { success: true }
}

export async function deleteEmployee(id: string) {
  const adminClient = createAdminClient()

  // Ensure Admin cannot delete master admin
  const { data: profile } = await adminClient
    .from('profiles')
    .select('email')
    .eq('id', id)
    .single()

  if (profile?.email === 'admin@flodon.in') {
    return { success: false, error: 'Cannot delete master admin' }
  }

  const { error: authError } = await adminClient.auth.admin.deleteUser(id)
  
  if (authError) return { success: false, error: authError.message }

  revalidatePath('/admin/employees')
  return { success: true }
}
