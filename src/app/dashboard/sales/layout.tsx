import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, Mail, BarChart3, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AddClientModal } from '@/components/sales/add-client-modal'

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        <div className="bg-card border rounded-lg p-4 flex flex-col gap-2 shadow-sm">
          <p className="font-semibold text-lg">{profile?.full_name}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Sales Department</Badge>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            href="/dashboard/sales"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/sales/clients"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Users className="w-4 h-4" />
            My Clients
          </Link>
          <Link
            href="/dashboard/sales/email-settings"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Mail className="w-4 h-4" />
            Email Settings
          </Link>
          <Link
            href="/dashboard/sales/analytics"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Link>
        </nav>
        
        <div className="mt-auto pt-4 border-t">
          <AddClientModal />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}
