import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '@/lib/mail';
import { getEmailTemplate } from '@/emails/templates';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { clientId, clientName, clientEmail, brandName, service, employeeName } = body;

    if (!clientId || !clientName || !clientEmail || !service || !employeeName) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Check for email connections to use custom SMTP
    const { data: connection } = await supabase
      .from('email_connections')
      .select('*')
      .eq('user_id', user.id)
      .single();

    let smtpConfig = null;
    if (connection && connection.provider === 'smtp' && connection.access_token) {
      try {
        smtpConfig = JSON.parse(Buffer.from(connection.access_token, 'base64').toString('utf-8'));
      } catch (e) {
        console.error("Failed to parse smtp config", e);
      }
    }

    // 2. Look up correct HTML template based on service
    const htmlEmail = getEmailTemplate(service, {
      clientName,
      brandName,
      employeeName,
    });

    // 3. Send email via our utility
    const response = await sendEmail({
      to: clientEmail,
      subject: `Introduction: Flodon AI Agency — Strategic Growth for ${brandName || clientName}`,
      fromName: smtpConfig?.displayName || 'Flodon CRM',
      fromEmail: smtpConfig?.fromEmail || smtpConfig?.user,
      html: htmlEmail,
    }, smtpConfig);

    // 4. On success: update clients table
    const { error: clientError } = await supabase
      .from('clients')
      .update({
        email_sent: true,
        email_sent_at: new Date().toISOString(),
      })
      .eq('id', clientId);

    if (clientError) {
      console.error('Error updating client email_sent status', clientError);
    }

    // 5. Log to activity_log
    const { error: logError } = await supabase
      .from('activity_log')
      .insert({
        user_id: user.id,
        action: 'outreach_sent',
        entity_type: 'client',
        entity_id: clientId,
        metadata: { service, sent_to: clientEmail, via: smtpConfig ? 'smtp' : 'resend' }
      });

    if (logError) {
      console.error('Error logging activity', logError);
    }

    return NextResponse.json({ success: true, messageId: response.messageId });

  } catch (error: any) {
    console.error('Error sending outreach email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
