'use client';

import { useState, useMemo, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { 
  startOfWeek, startOfMonth, startOfQuarter, parseISO, 
  isAfter, isBefore, subWeeks, subMonths, subQuarters, format, endOfDay, startOfDay
} from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Users, Mail, Activity, Target, Calendar } from 'lucide-react';

const COLORS = ['#FFFFFF', '#CCCCCC', '#888888', '#333333', '#666666'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-md shadow-2xl backdrop-blur-sm">
        <p className="text-sm font-bold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsClient({ initialClients, initialActivity, userId }: { initialClients: any[], initialActivity: any[], userId: string }) {
    const [clients, setClients] = useState(initialClients);
    const [activities, setActivities] = useState(initialActivity);
    const [dateRange, setDateRange] = useState('this_month');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const supabase = createClient();
    
    useEffect(() => {
        const clientSubscription = supabase.channel('clients-analytics-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'clients', filter: `added_by=eq.${userId}` }, async () => {
                const { data } = await supabase.from('clients').select('*').eq('added_by', userId);
                if (data) setClients(data);
            })
            .subscribe();

        const activitySubscription = supabase.channel('activities-analytics-changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log', filter: `user_id=eq.${userId}` }, (payload) => {
                setActivities((prev: any) => [payload.new, ...prev].slice(0, 20));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(clientSubscription);
            supabase.removeChannel(activitySubscription);
        };
    }, [supabase, userId]);

    const { filteredClients, previousClients } = useMemo(() => {
        const now = new Date();
        let startDate: Date;
        let prevStartDate: Date;

        if (dateRange === 'custom') {
            startDate = customStart ? startOfDay(parseISO(customStart)) : new Date(0);
            const endDate = customEnd ? endOfDay(parseISO(customEnd)) : now;
            const filtered = clients.filter((c: any) => {
                const d = parseISO(c.created_at);
                return isAfter(d, startDate) && isBefore(d, endDate);
            });
            return { filteredClients: filtered, previousClients: [] };
        }

        switch (dateRange) {
            case 'this_week':
                startDate = startOfWeek(now, { weekStartsOn: 1 });
                prevStartDate = subWeeks(startDate, 1);
                break;
            case 'this_quarter':
                startDate = startOfQuarter(now);
                prevStartDate = subQuarters(startDate, 1);
                break;
            case 'all':
                startDate = new Date(0);
                prevStartDate = new Date(0);
                break;
            case 'this_month':
            default:
                startDate = startOfMonth(now);
                prevStartDate = subMonths(startDate, 1);
                break;
        }

        const filtered = clients.filter((c: any) => isAfter(parseISO(c.created_at), startDate));
        
        let previous: any[] = [];
        if (dateRange !== 'all') {
             previous = clients.filter((c: any) => 
                isAfter(parseISO(c.created_at), prevStartDate) && 
                isBefore(parseISO(c.created_at), startDate)
            );
        }

        return { filteredClients: filtered, previousClients: previous };
    }, [clients, dateRange, customStart, customEnd]);

    const clientsAdded = filteredClients.length;
    const prevClientsAdded = previousClients.length;
    const clientGrowth = prevClientsAdded === 0 ? (clientsAdded > 0 ? 100 : 0) : Math.round(((clientsAdded - prevClientsAdded) / prevClientsAdded) * 100);
    const emailsSent = filteredClients.filter((c: any) => c.email_sent).length;
    const closedWon = filteredClients.filter((c: any) => c.pipeline_stage === 'closed_won').length;
    const conversionRate = clientsAdded === 0 ? 0 : Math.round((closedWon / clientsAdded) * 100);
    const activePipeline = filteredClients.filter((c: any) => ['lead', 'contacted', 'proposal'].includes(c.pipeline_stage)).length;

    const clientsOverTime = useMemo(() => {
        const map = new Map();
        filteredClients.forEach((c: any) => {
            const ds = format(parseISO(c.created_at), 'yyyy-MM-dd');
            map.set(ds, (map.get(ds) || 0) + 1);
        });
        return Array.from(map.entries())
            .sort((a,b) => a[0].localeCompare(b[0]))
            .map(([ds, count]) => ({ date: format(parseISO(ds), 'MMM dd'), count }));
    }, [filteredClients]);

    const clientsByService = useMemo(() => {
        const map = new Map();
        filteredClients.forEach((c: any) => {
            const service = c.service || 'Unknown';
            map.set(service, (map.get(service) || 0) + 1);
        });
        return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    }, [filteredClients]);

    const pipelineData = useMemo(() => {
        const stages = ['lead', 'contacted', 'proposal', 'closed_won'];
        const stageColors: Record<string, string> = { lead: '#333333', contacted: '#888888', proposal: '#CCCCCC', closed_won: '#FFFFFF' };
        return stages.map(stage => ({
            stage: stage.replace('_', ' ').toUpperCase(),
            count: filteredClients.filter((c: any) => c.pipeline_stage === stage).length,
            fill: stageColors[stage]
        }));
    }, [filteredClients]);

    const emailData = useMemo(() => {
        const map = new Map();
        filteredClients.forEach((c: any) => {
            const ds = format(parseISO(c.created_at), 'yyyy-MM-dd');
            if (!map.has(ds)) map.set(ds, { raw: ds, sent: 0, pending: 0 });
            if (c.email_sent) map.get(ds).sent += 1;
            else map.get(ds).pending += 1;
        });
        return Array.from(map.values())
            .sort((a,b) => a.raw.localeCompare(b.raw))
            .map(d => ({ date: format(parseISO(d.raw), 'MMM dd'), Sent: d.sent, Pending: d.pending }));
    }, [filteredClients]);

    const industryData = useMemo(() => {
        const map = new Map();
        filteredClients.forEach((c: any) => {
            const industry = c.industry || 'Other';
            map.set(industry, (map.get(industry) || 0) + 1);
        });
        return Array.from(map.entries()).map(([industry, count]) => ({ industry, count }));
    }, [filteredClients]);

    const exportCSV = () => {
        const headers = ['Name', 'Brand', 'Service', 'Email', 'Pipeline Stage', 'Email Sent', 'Date Added'];
        const rows = clients.map((c: any) => [
            `"${c.name}"`, `"${c.brand_name || ''}"`, `"${c.service || ''}"`, `"${c.email}"`, 
            `"${c.pipeline_stage || 'lead'}"`, c.email_sent ? 'Yes' : 'No', 
            `"${format(parseISO(c.created_at), 'yyyy-MM-dd')}"`
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri); link.setAttribute("download", `clients_analytics_${format(new Date(), 'yyyyMMdd')}.csv`);
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border/50">
                <div className="space-y-2">
                    <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Metrics & performance</p>
                    <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">
                        Sales Analytics
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">Real-time performance metrics and insights.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Select value={dateRange} onValueChange={(val) => setDateRange(val || 'all')}>
                            <SelectTrigger className="w-[140px] border-0 bg-transparent shadow-none focus:ring-0 text-[13px] font-medium">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="this_week">This Week</SelectItem>
                                <SelectItem value="this_month">This Month</SelectItem>
                                <SelectItem value="this_quarter">This Quarter</SelectItem>
                                <SelectItem value="all">All Time</SelectItem>
                                <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {dateRange === 'custom' && (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                            <Input type="date" className="h-9 w-36 bg-secondary" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
                            <span className="text-muted-foreground">-</span>
                            <Input type="date" className="h-9 w-36 bg-secondary" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
                        </div>
                    )}
                    <Button onClick={exportCSV} variant="default" className="gap-2 shadow-none font-semibold uppercase tracking-wider text-xs h-9">
                        <Download className="h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[ 
                    { title: 'Clients Added', val: clientsAdded, sub: `${clientGrowth >= 0 ? '+' : ''}${clientGrowth}% vs prev`, icon: Users, color: 'text-foreground' },
                    { title: 'Emails Sent', val: emailsSent, sub: 'In current range', icon: Mail, color: 'text-foreground' },
                    { title: 'Active Pipeline', val: activePipeline, sub: 'Current deals', icon: Activity, color: 'text-foreground' },
                    { title: 'Conversion Rate', val: `${conversionRate}%`, sub: 'Closed won / Total', icon: Target, color: 'text-foreground' }
                ].map((s, i) => (
                    <Card key={i} className="relative overflow-hidden bg-card border-border">
                        <div className={`absolute top-0 right-0 p-4 opacity-5 ${s.color}`}>
                            <s.icon className="h-12 w-12" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-[32px] font-bold tracking-tight">{s.val}</div>
                            <p className="text-[11px] font-medium text-muted-foreground mt-1">{s.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-card">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Clients Over Time</CardTitle>
                                <CardDescription>Growth of client base in selected period</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[350px] pl-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={clientsOverTime}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333333" opacity={0.5} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#888888'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#888888'}} />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="count" name="Clients" stroke="#FFFFFF" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-card">
                            <CardHeader><CardTitle className="text-base">Service Mix</CardTitle></CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={clientsByService} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                                            {clientsByService.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                                        </Pie>
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader><CardTitle className="text-base">Pipeline Funnel</CardTitle></CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart layout="vertical" data={pipelineData} margin={{ left: 20 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#888888'}} width={80} />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" name="Clients" radius={[0, 4, 4, 0]} barSize={20}>
                                            {pipelineData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Card className="bg-card">
                            <CardHeader><CardTitle className="text-base">Email Status</CardTitle></CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={emailData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333333" opacity={0.5} />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#888888'}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#888888'}} />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend verticalAlign="top" height={36}/>
                                        <Bar dataKey="Sent" stackId="stack" fill="#FFFFFF" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="Pending" stackId="stack" fill="#333333" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader><CardTitle className="text-base">Industry Breakdown</CardTitle></CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={industryData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333333" opacity={0.5} />
                                        <XAxis dataKey="industry" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#888888'}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#888888'}} />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" name="Clients" fill="#CCCCCC" radius={[4, 4, 0, 0]} barSize={32} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <Card className="h-full bg-card">
                        <CardHeader className="border-b border-border pb-4">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Activity className="h-4 w-4 text-foreground" /> ACTIVITY FEED
                            </CardTitle>
                            <CardDescription>Real-time system events</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/50">
                                {activities.length === 0 ? (
                                    <div className="p-8 text-center"><p className="text-[13px] text-muted-foreground italic">No recent activity detected.</p></div>
                                ) : (
                                    activities.map((activity: any) => (
                                        <div key={activity.id} className="p-4 hover:bg-white/[0.02] transition-colors group">
                                            <p className="text-[13px] font-semibold tracking-tight">{activity.action}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                                                    {activity.entity_type} {activity.metadata?.name && <span className="text-foreground/60 font-medium">· {activity.metadata.name}</span>}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground uppercase font-mono">
                                                    {format(parseISO(activity.created_at), 'HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
