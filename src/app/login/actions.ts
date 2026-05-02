'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  const user = authData.user
 
  if (user) {
    // Fetch profile to check departments and admin status
    const { data: profile } = await supabase
      .from('profiles')
      .select('departments, is_admin')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.is_admin || user.email === 'admin@flodon.in'

    if (isAdmin) {
      redirect('/admin')
    }

    const departments = profile?.departments || []

    revalidatePath('/', 'layout')

    if (departments.length === 1) {
      redirect(`/dashboard/${departments[0]}`)
    } else {
      redirect('/dashboard') // Dashboard will show department picker
    }
  }

  return { error: 'Unknown error occurred' }
}
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
