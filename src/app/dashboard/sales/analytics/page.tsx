import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AnalyticsClient from './AnalyticsClient';

export const metadata = {
  title: 'Analytics Dashboard | Flodon CRM',
  description: 'View sales and client analytics.',
};

export default async function AnalyticsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch initial clients
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('added_by', user.id);

  // Fetch recent activity
  const { data: activityLog } = await supabase
    .from('activity_log')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AnalyticsClient 
        initialClients={clients || []} 
        initialActivity={activityLog || []} 
        userId={user.id} 
      />
    </div>
  );
}
