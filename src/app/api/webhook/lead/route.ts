import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const WEBSITE_AGENT_ID = process.env.WEBSITE_AGENT_ID;

if (!WEBHOOK_SECRET) console.warn("⚠️ WEBHOOK_SECRET is not set. Webhook will reject all requests.");
if (!WEBSITE_AGENT_ID) console.warn("⚠️ WEBSITE_AGENT_ID is not set. Lead insertion may fail RLS or FK constraints.");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role to bypass RLS
);

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const {
      name,
      email,
      phone,
      companyName,
      website,
      businessDescription,
      targetAudience,
      offerings,
      monthlyRevenue,
      averageDealSize,
      currentLeadSources,
      monthlyLeads,
      usingAI,
      biggestBottleneck,
      triedToFix,
      goal90Days,
      whyNow,
      readyToImplement,
      investmentLevel,
      decisionMaker,
      readyToMoveForward,
      anythingElse,
      slotId,
      date,
      startTime,
      endTime
    } = payload;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check for duplicate
    const { data: existingLead } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .single();

    if (existingLead) {
      return NextResponse.json({ 
        message: 'Lead already exists', 
        leadId: existingLead.id 
      }, { status: 200 });
    }

    // Insert into clients
    const { data: newLead, error: leadError } = await supabase
      .from('clients')
      .insert({
        name,
        email,
        phone: phone || null,
        brand_name: companyName || null,
        notes: anythingElse || null,
        pipeline_stage: 'lead',
        added_by: WEBSITE_AGENT_ID,
        added_by_name: 'Website Lead Agent',
        lead_source: 'website',
        source_url: request.headers.get('referer') || 'https://flodon.in',
        qualification: {
          website,
          businessDescription,
          targetAudience,
          offerings,
          monthlyRevenue,
          averageDealSize,
          currentLeadSources,
          monthlyLeads,
          usingAI,
          biggestBottleneck,
          triedToFix,
          goal90Days,
          whyNow,
          readyToImplement,
          investmentLevel,
          decisionMaker,
          readyToMoveForward
        }
      })
      .select()
      .single();

    if (leadError) {
      console.error('Lead insertion error:', leadError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Insert into calls if booking exists
    if (date && startTime) {
      const scheduledAt = new Date(`${date}T${startTime}`).toISOString();
      const { error: callError } = await supabase
        .from('calls')
        .insert({
          client_id: newLead.id,
          prospect_name: name,
          company: companyName,
          scheduled_at: scheduledAt,
          slot_id: slotId,
          source: 'website',
          status: 'booked'
        });

      if (callError) {
        console.error('Call insertion error:', callError);
      }
    }

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: WEBSITE_AGENT_ID,
      action: `Lead created via website: ${name}`,
      entity_type: 'client',
      entity_id: newLead.id
    });

    return NextResponse.json({ 
      success: true, 
      leadId: newLead.id,
      message: 'Lead created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
