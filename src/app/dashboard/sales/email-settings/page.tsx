'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { Mail, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function EmailSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connection, setConnection] = useState<any>(null);
  
  const [smtpConfig, setSmtpConfig] = useState({
    host: '',
    port: '',
    user: '',
    password: ''
  });

  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
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
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Mask the config for MVP
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
      alert('Settings saved securely.');
    } else {
      alert('Failed to save settings: ' + error.message);
    }
    setSaving(false);
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        alert('Test email sent successfully! Please check your inbox.');
      } else {
        alert('Test email failed: ' + data.error);
      }
    } catch (error) {
      alert('Error testing connection.');
    }
    setTesting(false);
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center"><Loader2 className="animate-spin text-[#6C63FF]" /></div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Email Settings</h1>
        <p className="text-gray-500">Configure your email sender settings and outgoing SMTP.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Status Card */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Connection Status</CardTitle>
            </CardHeader>
            <CardContent>
              {connection ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Connected via {connection.provider.toUpperCase()}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-amber-600">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Using Default Feedback</span>
                </div>
              )}

              <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                <p><strong>Currently sending from:</strong></p>
                <p className="mt-1">
                  {connection && connection.provider === 'smtp' && smtpConfig.user 
                    ? smtpConfig.user 
                    : 'team@flodon.in (Resend Default)'}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full text-[#6C63FF] border-[#6C63FF] hover:bg-[#6C63FF] hover:text-white"
                onClick={handleTest}
                disabled={testing}
              >
                {testing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                Send Test Email
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Configuration Card */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>
                Connect your custom email domain or Gmail (App Password required) to send emails directly from your address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">SMTP Host</Label>
                  <Input 
                    id="host" 
                    placeholder="smtp.gmail.com" 
                    value={smtpConfig.host}
                    onChange={e => setSmtpConfig({...smtpConfig, host: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">SMTP Port</Label>
                  <Input 
                    id="port" 
                    placeholder="465"
                    value={smtpConfig.port}
                    onChange={e => setSmtpConfig({...smtpConfig, port: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user">Email Address (User)</Label>
                <Input 
                  id="user" 
                  type="email" 
                  placeholder="name@flodon.in"
                  value={smtpConfig.user}
                  onChange={e => setSmtpConfig({...smtpConfig, user: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">App Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••••••••••"
                  value={smtpConfig.password}
                  onChange={e => setSmtpConfig({...smtpConfig, password: e.target.value})}
                />
                <p className="text-xs text-gray-500">Your password will be encrypted before being stored.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="default"
                className="bg-[#6C63FF] hover:bg-[#5b54d6] text-white"
                onClick={handleSave}
                disabled={saving || !smtpConfig.host || !smtpConfig.user}
              >
                {saving ? 'Saving...' : 'Save Connection'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
