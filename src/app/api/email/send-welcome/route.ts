import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { resend } from '@/lib/resend';
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

    // 1. Check for email connections to potentially use custom SMTP 
    // (For now, we'll use Resend but potentially check the DB connection to grab a tailored 'from' or fallback)
    const { data: emailConnection } = await supabase
      .from('email_connections')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Default sender
    let fromEmail = 'team@flodon.in';
    
    // For MVP if they verified a generic email in resend, maybe use that.
    // In actual production, Resend requires domain verification. 
    // We'll stick to the default unless configured otherwise.
    
    // 2. Look up correct HTML template based on service
    const htmlEmail = getEmailTemplate(service, {
      clientName,
      brandName,
      employeeName,
    });

    // 3. Send via Resend API
    const response = await resend.emails.send({
      from: \`Flodon <\${fromEmail}>\`,
      to: clientEmail,
      subject: \`Welcome to Flodon, \${clientName} — Let's Build Something Great\`,
      html: htmlEmail,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

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
        action: 'email_sent',
        entity_type: 'client',
        entity_id: clientId,
        metadata: { service, sent_to: clientEmail }
      });

    if (logError) {
      console.error('Error logging activity', logError);
    }

    return NextResponse.json({ success: true, messageId: response.data?.id });

  } catch (error: any) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
