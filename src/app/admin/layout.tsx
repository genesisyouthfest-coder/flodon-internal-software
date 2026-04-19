import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== 'admin@flodon.in') {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-background selection:bg-white selection:text-black">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-background ">
        <div className="max-w-7xl mx-auto w-full p-12">
          {children}
        </div>
      </main>
    </div>
  )
}
