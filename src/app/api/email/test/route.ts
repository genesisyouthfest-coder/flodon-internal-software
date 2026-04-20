import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    let smtpConfig = body.smtpConfig;

    // 1. If not in body, check for email connections in DB
    if (!smtpConfig || !smtpConfig.host) {
      const { data: connection } = await supabase
        .from('email_connections')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (connection && connection.provider === 'smtp' && connection.access_token) {
        try {
          smtpConfig = JSON.parse(Buffer.from(connection.access_token, 'base64').toString('utf-8'));
        } catch (e) {
          console.error("Failed to parse smtp config from DB", e);
        }
      }
    }

    const toEmail = user.email || 'team@flodon.in';

    // 2. Send test email via our new utility
    const response = await sendEmail({
      to: toEmail,
      subject: 'Flodon CRM - Test Connection Successful',
      fromName: smtpConfig?.displayName || 'Flodon CRM',
      fromEmail: smtpConfig?.fromEmail || smtpConfig?.user,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #000000; padding: 24px; text-align: center; border-bottom: 1px solid #333;">
            <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: -0.05em; text-transform: uppercase; font-weight: 800;">Connection Successful!</h1>
          </div>
          <div style="padding: 32px; background-color: #000000; color: #ffffff;">
            <p style="font-size: 16px; line-height: 1.5; color: #888888; font-weight: 500;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.5; color: #ffffff;">Your email settings have been successfully configured in the <strong style="color: #ffffff;">Flodon CRM</strong>.</p>
            <p style="font-size: 16px; line-height: 1.5; color: #888888;">You can now use these settings to send automated welcome emails and notifications to your clients directly from your account.</p>
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #333;">
               <p style="font-size: 12px; color: #444; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">Sent via ${smtpConfig ? `SMTP (${smtpConfig.user})` : 'Resend Default'}</p>
               ${smtpConfig?.fromEmail ? `<p style="font-size: 11px; color: #444; margin-top: 4px;">Displayed to client as: ${smtpConfig.fromEmail}</p>` : ''}
            </div>
          </div>
        </div>
      `
    }, smtpConfig);

    return NextResponse.json({ success: true, messageId: response.messageId });

  } catch (error: any) {
    console.error('Error sending test email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
