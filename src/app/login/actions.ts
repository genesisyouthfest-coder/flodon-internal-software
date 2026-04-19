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
    if (user.email === 'admin@flodon.in') {
      redirect('/admin')
    }

    // Fetch profile to check departments
    const { data: profile } = await supabase
      .from('profiles')
      .select('departments')
      .eq('id', user.id)
      .single()

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
