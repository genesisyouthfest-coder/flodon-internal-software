import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // We are removing the global TopNav to allow module layouts (like Sales, Admin)
  // to define their own cohesive sidebar + content structures, matching the requested Admin style.
  return <>{children}</>
}
