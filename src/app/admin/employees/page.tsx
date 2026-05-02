import { createClient } from '@/utils/supabase/server'
import { Metadata } from 'next'
import Link from 'next/link'
import ClickableRow from '@/components/ClickableRow'

export const metadata: Metadata = {
  title: 'Employee Registry',
}

export default async function AdminEmployeesPage() {
  const supabase = await createClient()

  const { data: employees } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-foreground">
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">Internal Directory</p>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase">System Agents</h1>
          <p className="text-sm font-semibold tracking-widest text-foreground/80 mt-2">Manage personnel and department assignments.</p>
        </div>
        <Link href="/admin/employees/add" className="btn-solid">
          + Add Agent
        </Link>
      </div>

      <div className="border-2 border-foreground bg-card overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px] md:min-w-0">
          <thead className="bg-foreground text-background">
            <tr>
              <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Identity</th>
              <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Email</th>
              <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Departments</th>
              <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-foreground">
            {!employees || employees.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm font-bold uppercase tracking-widest text-foreground/50">
                   No employees found in direct registry.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <ClickableRow key={emp.id} href={`/admin/employees/${emp.id}`} className="hover:bg-foreground hover:text-background transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold uppercase tracking-wide group-hover:text-background">{emp.full_name}</p>
                    <p className="text-[10px] text-foreground/60 font-black tracking-widest uppercase mt-0.5 group-hover:text-background/80">
                       {emp.is_admin ? 'Super Admin' : 'Field Agent'}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-medium lowercase">
                    {emp.email}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                       {emp.departments?.length > 0 ? emp.departments.map((d: string) => (
                         <span key={d} className="px-2 py-0.5 border border-foreground/40 text-[9px] font-black uppercase tracking-tight group-hover:border-background/40">
                            {d}
                         </span>
                       )) : (
                         <span className="text-[9px] font-black uppercase opacity-20 tracking-tight">No Assignment</span>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-2 border-foreground group-hover:border-background ${emp.is_active === false ? 'bg-red-500 text-white' : ''}`}>
                       <span className={`h-1.5 w-1.5 rounded-full ${emp.is_active === false ? 'bg-white' : 'bg-green-500 animate-pulse'}`} />
                       {emp.is_active === false ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                </ClickableRow>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
