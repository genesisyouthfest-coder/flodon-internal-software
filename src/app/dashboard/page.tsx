import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutDashboard } from 'lucide-react'

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

  if (departments.length === 1) {
    redirect(`/dashboard/${departments[0].toLowerCase()}`)
  }

  if (departments.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Welcome!</CardTitle>
            <CardDescription>You don't have any departments assigned.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Please contact your administrator to get access to specific modules.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Select a Module</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept: string) => (
          <Link href={`/dashboard/${dept.toLowerCase()}`} key={dept}>
            <Card className="hover:border-primary transition-colors cursor-pointer capitalize">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <LayoutDashboard className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{dept}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
