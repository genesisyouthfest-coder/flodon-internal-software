import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SalesSidebar } from '@/components/sales/sales-sidebar'

export default async function SalesLayout({
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

  return (
    <div className="flex min-h-screen bg-background selection:bg-white selection:text-black">
      <SalesSidebar />
      <main className="flex-1 overflow-auto bg-background ">
        <div className="max-w-7xl mx-auto w-full p-12">
          {children}
        </div>
      </main>
    </div>
  )
}
