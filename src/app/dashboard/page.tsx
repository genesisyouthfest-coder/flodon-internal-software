import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardIndex() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('departments')
    .eq('id', user.id)
    .single()

  const departments = profile?.departments || []

  // Default redirect logic to sales for now since sales is rebuilt
  redirect('/dashboard/sales/clients')

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-700">
        <h1 className="text-4xl font-extrabold uppercase tracking-tight border-b-2 border-foreground pb-4">Select Operations Module</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept: string) => (
            <Link href={`/dashboard/${dept.toLowerCase()}`} key={dept} className="card-solid p-6 block hover:bg-foreground hover:text-background transition-colors group">
              <h2 className="text-2xl font-bold uppercase">{dept}</h2>
              <p className="text-xs font-semibold tracking-widest mt-2 uppercase opacity-60 group-hover:opacity-100">Access Module &rarr;</p>
            </Link>
          ))}
          {departments.length === 0 && (
            <div className="col-span-full border-2 border-foreground p-8 text-center bg-foreground text-background">
               <p className="font-bold tracking-widest uppercase">No Modules Assigned</p>
               <p className="text-xs mt-2 uppercase opacity-80">Contact your administrator.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
