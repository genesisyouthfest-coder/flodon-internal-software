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

    // 3. Send test email via Resend API
    const response = await resend.emails.send({
      from: \`Flodon <\${fromEmail}>\`,
      to: toEmail,
      subject: \`Flodon CRM - Test Connection Successful\`,
      html: \`
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #6C63FF;">Test Successful</h2>
          <p>Hi \${user.user_metadata?.full_name || 'Team'},</p>
          <p>Your email connection is working correctly. You can now send welcome emails to added clients.</p>
          <p>Best,<br/>Flodon System</p>
        </div>
      \`,
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
