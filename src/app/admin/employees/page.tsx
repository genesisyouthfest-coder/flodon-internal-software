import { createClient } from '@/utils/supabase/server'
import { AddEmployeeModal } from '@/components/admin/AddEmployeeModal'
import { EmployeeTable } from '@/components/admin/EmployeeTable'

export default async function EmployeesPage() {
  const supabase = await createClient()

  const { data: employees } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border/50">
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Personnel Management</p>
          <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">Employees</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage system users and their department access.</p>
        </div>
        <AddEmployeeModal />
      </div>

      <EmployeeTable employees={employees || []} />
    </div>
  )
}
