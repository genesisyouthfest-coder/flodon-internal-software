import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '@/lib/mail';
import { generateOutreachEmail } from '@/lib/gemini';
import { FLODON_SERVICES } from '@/lib/constants';
import fs from 'fs';
import path from 'path';

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

    // 2. Look up service description
    const serviceInfo = FLODON_SERVICES.find(s => s.id === service) || {
      label: service,
      description: 'AI automation services for business growth'
    };

    // 3. Read the Generator Prompt
    let promptTemplate = "";
    try {
      const promptPath = path.join(process.cwd(), '..', 'Resources', 'Email_GeneratorPrompt.txt');
      promptTemplate = fs.readFileSync(promptPath, 'utf8');
    } catch (e) {
      console.warn("Could not read Email_GeneratorPrompt.txt, using fallback logic");
      promptTemplate = "Generate a short, direct outreach email for {{NAME}} regarding {{SERVICE_NAME}}.";
    }

    // 4. Generate email via Gemini
    const { subject, body: emailBody } = await generateOutreachEmail({
      recipientName: clientName,
      recipientRole: body.role || 'Business Owner', // Support optional role
      businessName: brandName,
      industry: body.industry || 'your industry',
      serviceName: serviceInfo.label,
      serviceDescription: serviceInfo.description,
      promptTemplate: promptTemplate
    });

    // 5. Send email via our utility
    const response = await sendEmail({
      to: clientEmail,
      subject: subject,
      fromName: smtpConfig?.displayName || 'Flodon CRM',
      html: `
        <div style="font-family: 'Inter', sans-serif; color: #0a0a0a; white-space: pre-wrap; line-height: 1.6; font-size: 16px;">
${emailBody}
        </div>
      `,
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
