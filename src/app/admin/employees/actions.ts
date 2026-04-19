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
      name: formData.name,
      email: formData.email,
      departments: formData.departments,
      is_active: true
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

  const { error } = await adminClient
    .from('profiles')
    .update({ is_active: active })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/employees')
  return { success: true }
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
