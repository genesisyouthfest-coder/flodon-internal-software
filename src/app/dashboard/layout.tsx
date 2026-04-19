import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { TopNav } from '@/components/top-nav'

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const departments = profile?.departments || []

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <TopNav
        user={{
          email: user.email!,
          name: profile?.full_name || '',
        }}
        departments={departments}
      />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
