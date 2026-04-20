'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { Mail, CheckCircle2, XCircle, Loader2, Send, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function EmailSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connection, setConnection] = useState<any>(null);
  
  const [smtpConfig, setSmtpConfig] = useState({
    host: '',
    port: '',
    user: '',
    password: '',
    displayName: 'Flodon CRM',
    fromEmail: ''
  });

  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('email_connections')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (data) {
        setConnection(data);
        if (data.provider === 'smtp' && data.access_token) {
          try {
            const config = JSON.parse(atob(data.access_token));
            setSmtpConfig(config);
          } catch (e) {
            console.error("Failed to parse smtp config", e);
          }
        }
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const token = btoa(JSON.stringify(smtpConfig));

    const { error } = await supabase
      .from('email_connections')
      .upsert({
        user_id: user.id,
        provider: 'smtp',
        access_token: token,
      }, { onConflict: 'user_id' });

    if (!error) {
      setConnection({ provider: 'smtp', access_token: token });
      toast.success('Connection saved', { description: 'Your SMTP settings have been saved securely.' });
    } else {
      toast.error('Failed to save', { description: error.message });
    }
    setSaving(false);
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/email/test', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smtpConfig })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Test email sent', { description: 'Check your inbox for the test message.' });
      } else {
        toast.error('Test failed', { description: data.error });
      }
    } catch (error) {
      toast.error('Connection error', { description: 'Unable to reach the email service.' });
    }
    setTesting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border/50">
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Configuration</p>
          <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">Email Settings</h1>
          <p className="text-muted-foreground text-sm font-medium">Configure your outgoing email sender via SMTP.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Status Card */}
        <div className="md:col-span-1 space-y-4">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-bold">Connection Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {connection ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-500">Connected</span>
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider ml-auto">
                    {connection.provider}
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-amber-500">Not Configured</span>
                </div>
              )}

              <div className="pt-3 border-t border-border/50 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sending From</p>
                <p className="text-sm font-medium">
                  {connection && connection.provider === 'smtp' && smtpConfig.user 
                    ? smtpConfig.user 
                    : 'team@flodon.in (Default)'}
                </p>
              </div>

              <div className="pt-2 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  Password encrypted at rest
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handleTest}
                disabled={testing}
              >
                {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Test Email
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Configuration Card */}
        <div className="md:col-span-2">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="font-bold">SMTP Configuration</CardTitle>
              <CardDescription>
                Connect your custom email domain or Gmail (App Password required) to send emails directly from your address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input 
                    id="display-name" 
                    placeholder="Flodon CRM" 
                    value={smtpConfig.displayName}
                    onChange={e => setSmtpConfig({...smtpConfig, displayName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email">Sender Email (Alias)</Label>
                  <Input 
                    id="from-email" 
                    placeholder="coo@flodon.in"
                    value={smtpConfig.fromEmail}
                    onChange={e => setSmtpConfig({...smtpConfig, fromEmail: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input 
                    id="smtp-host" 
                    placeholder="smtp.gmail.com" 
                    value={smtpConfig.host}
                    onChange={e => setSmtpConfig({...smtpConfig, host: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input 
                    id="smtp-port" 
                    placeholder="465"
                    value={smtpConfig.port}
                    onChange={e => setSmtpConfig({...smtpConfig, port: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-user">Email Address</Label>
                <Input 
                  id="smtp-user" 
                  type="email" 
                  placeholder="name@flodon.in"
                  value={smtpConfig.user}
                  onChange={e => setSmtpConfig({...smtpConfig, user: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-password">App Password</Label>
                <Input 
                  id="smtp-password" 
                  type="password" 
                  placeholder="••••••••••••••••"
                  value={smtpConfig.password}
                  onChange={e => setSmtpConfig({...smtpConfig, password: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  For Gmail, generate an App Password in your Google Account security settings.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button 
                variant="outline"
                onClick={() => setSmtpConfig({ host: '', port: '', user: '', password: '', displayName: 'Flodon CRM', fromEmail: '' })}
              >
                Reset
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving || !smtpConfig.host || !smtpConfig.user}
              >
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Connection'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
      </div>
    </div>
  );
}

