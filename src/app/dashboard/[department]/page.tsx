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

  if (!departments.includes(department)) {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold capitalize tracking-tight">{department} Dashboard</h1>
        {department === 'sales' && (
          <Button asChild variant="default" className="shadow-md">
            <Link href={`/dashboard/${department}/analytics`} className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> View Analytics
            </Link>
          </Button>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {department === 'sales' && (
          <Card className="hover:shadow-lg transition-all border-none ring-1 ring-border group">
            <Link href={`/dashboard/${department}/analytics`}>
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
            <CardTitle>Welcome to {department}</CardTitle>
            <CardDescription>Your workspace for {department} operations</CardDescription>
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
