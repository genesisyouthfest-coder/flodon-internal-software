'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addClient(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Fetch agent name for the record
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const clientData = {
    name: formData.get('name') as string,
    brand_name: formData.get('brand_name') as string,
    role: formData.get('role') as string,
    industry: formData.get('industry') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    ig_profile: formData.get('ig_profile') as string,
    fb_profile: formData.get('fb_profile') as string,
    country: formData.get('country') as string,
    service: formData.get('service') as string,
    notes: formData.get('notes') as string,
    added_by: user.id,
    added_by_name: profile?.full_name || 'System Agent',
    pipeline_stage: 'lead',
    lead_source: 'manual'
  }

  const { data: insertData, error } = await supabase.from('clients').insert([clientData]).select().single()

  if (error) {
    return { error: error.message }
  }

  // AUTOMATED OUTREACH: Use the existing unified mailing system
  try {
    const { sendEmail } = await import('@/lib/mail');
    
    // 1. Fetch any existing SMTP connection for this agent
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

    // 2. Dispatch via unified utility (SMTP if connected, else Resend fallback)
    await sendEmail({
      to: clientData.email,
      subject: `Welcome to Flodon: Connecting Regarding ${clientData.industry}`,
      fromName: 'Flodon Operations',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; border: 2px solid black; padding: 40px;">
          <h1 style="text-transform: uppercase; letter-spacing: -2px; font-size: 32px;">Flodon System Grid</h1>
          <p style="text-transform: uppercase; font-weight: bold; font-size: 12px; color: #666;">Onboarding Department</p>
          <hr style="border: 1px solid black; margin: 30px 0;" />
          <p>Hello <strong>${clientData.name}</strong>,</p>
          <p>Our intelligence team has just initialized your record within the Flodon System for the <strong>${clientData.service}</strong> module.</p>
          <p>An agent will be in touch shortly to finalize the connection details.</p>
          <br />
          <p style="font-size: 10px; font-weight: bold; border-top: 2px solid black; padding-top: 20px;">
            © 2026 FLODON INTERNAL CRM
          </p>
        </div>
      `
    }, smtpConfig);

    // 3. Mark as email sent in DB
    await supabase.from('clients').update({ 
      email_sent: true, 
      email_sent_at: new Date().toISOString() 
    }).eq('id', insertData.id);

  } catch (e) {
    console.error('Email Automation Failed:', e);
  }

  // Log activity
  await supabase.from('activity_log').insert([{
    user_id: user.id,
    action: `Added new client: ${clientData.name}`,
    entity_type: 'client'
  }])


  revalidatePath('/dashboard/sales/clients')
  revalidatePath('/admin/clients')
  redirect('/dashboard/sales/clients')
}

export async function updateClientStage(id: string, stage: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('clients')
    .update({ pipeline_stage: stage })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/sales/clients/${id}`)
  revalidatePath('/dashboard/sales/clients')
  return { success: true }
}
export async function updateClientNotes(id: string, notes: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('clients')
    .update({ notes })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/sales/clients/${id}`)
  return { success: true }
}

export async function deleteClient(id: string) {
  // Use Service Role to bypass potential SELECT/DELETE RLS restrictions during authorization check
  const adminSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const supabase = await createClient() // Standard client for session auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized: No active session.' }

  // Check clearance using the administrative client
  const { data: client, error: fetchError } = await adminSupabase
    .from('clients')
    .select('added_by')
    .eq('id', id)
    .single()
  
  if (fetchError || !client) {
    return { error: 'Record Access Failure: Target lead does not exist or clearance is insufficient.' }
  }

  if (client.added_by !== user.id && user.email !== 'admin@flodon.in') {
    return { error: 'Clearance Denied: You do not have the authority to permanently destroy this record.' }
  }

  // Execute guaranteed destruction
  const { data, error } = await adminSupabase
    .from('clients')
    .delete()
    .eq('id', id)
    .select()

  if (error) return { error: `Database Destruction Error: ${error.message}` }
  if (!data || data.length === 0) return { error: 'Record already destroyed or moved.' }

  revalidatePath('/dashboard/sales/clients')
  revalidatePath('/admin/clients')
  return { success: true }
}
