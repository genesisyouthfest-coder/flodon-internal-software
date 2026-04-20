import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { resend } from '@/lib/resend';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Default sender
    let fromEmail = 'team@flodon.in';
    const toEmail = user.email || 'team@flodon.in';

    if (!resend) {
      return NextResponse.json({ success: false, error: 'Email service not configured. Set RESEND_API_KEY.' }, { status: 503 });
    }

    // 3. Send test email via Resend API
    const response = await resend.emails.send({
      from: `Flodon <${fromEmail}>`,
      to: toEmail,
      subject: 'Flodon CRM - Test Connection Successful',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #6C63FF; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Connection Successful!</h1>
          </div>
          <div style="padding: 32px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #333; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; color: #333; line-height: 1.5;">Your email settings have been successfully configured in the Flodon CRM.</p>
            <p style="font-size: 16px; color: #333; line-height: 1.5;">You can now use these settings to send automated welcome emails and notifications to your clients directly from your account.</p>
          </div>
        </div>
      `
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return NextResponse.json({ success: true, messageId: response.data?.id });

  } catch (error: any) {
    console.error('Error sending test email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
