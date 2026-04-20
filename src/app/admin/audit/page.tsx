import { createClient } from '@/utils/supabase/server'
import { AuditLogTable } from '@/components/admin/AuditLogTable'

export default async function AuditLogPage() {
  const supabase = await createClient()

  const { data: logs } = await supabase
    .from('activity_log')
    .select(`
      *,
      profiles (
        full_name
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-12">
      <div className="pb-4 border-b border-border/50">
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">System Integrity</p>
          <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">Audit Log</h1>
          <p className="text-muted-foreground text-sm font-medium">Track all actions performed by employees across the system.</p>
        </div>
      </div>

      <AuditLogTable logs={logs || []} />
    </div>
  )
}
