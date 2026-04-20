import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ department: string }>
}) {
  const { department } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('departments')
    .eq('id', user.id)
    .single();

  const departments = profile?.departments || [];

  const deptLower = department.toLowerCase();

  // If a specialized folder exists (like 'sales'), redirect there to get the full feature set
  if (deptLower === 'sales') {
    redirect(`/dashboard/sales`);
  }

  if (!departments.map(d => d.toLowerCase()).includes(deptLower)) {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold capitalize tracking-tight">{deptLower} Dashboard</h1>
        {deptLower === 'sales' && (
          <Button asChild variant="default" className="shadow-md">
            <Link href={`/dashboard/${department}/analytics`} className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> View Analytics
            </Link>
          </Button>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deptLower === 'sales' && (
          <Card className="hover:shadow-lg transition-all border-none ring-1 ring-border group">
            <Link href={`/dashboard/${deptLower}/analytics`}>
              <CardHeader>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>Track conversions, pipeline, and email performance.</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        )}
        
        <Card className="border-none ring-1 ring-border">
          <CardHeader>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Welcome to {deptLower}</CardTitle>
            <CardDescription>Your workspace for {deptLower} operations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              All tools, clients, and pipelines for this specific module will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
