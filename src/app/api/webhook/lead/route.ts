import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const WEBSITE_AGENT_ID = process.env.WEBSITE_AGENT_ID;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_ORIGINS = ['https://flodon.in', 'http://localhost:3000', 'http://localhost:3001'];

function getCorsHeaders(origin: string) {
  const isAllowed = ALLOWED_ORIGINS.includes(origin);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const corsHeaders = getCorsHeaders(origin);

  try {
    // 1. Bearer Token Auth
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders 
      });
    }

    // 2. Origin/Referer Restriction
    const referer = request.headers.get('referer') || '';
    const isOriginAllowed = ALLOWED_ORIGINS.some(allowed => 
      referer.startsWith(allowed) || origin.startsWith(allowed)
    );

    if (!isOriginAllowed && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Forbidden: Request origin not allowed' }, { 
        status: 403,
        headers: corsHeaders 
      });
    }

    const payload = await request.json();
    const {
      name,
      email,
      phone,
      website,
      businessDescription,
      monthlyRevenue,
      currentLeadSources,
      biggestBottleneck,
      goal90Days,
      investmentLevel,
      readyToImplement,
      decisionMaker,
      date,
      startTime,
      endTime
    } = payload;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Check for duplicate
    const { data: existingLead } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .single();

    let leadId = existingLead?.id;

    if (!leadId) {
      // Insert into clients
      const { data: newLead, error: leadError } = await supabase
        .from('clients')
        .insert({
          name,
          email,
          phone: phone || null,
          brand_name: website || null,
          pipeline_stage: 'lead',
          added_by: WEBSITE_AGENT_ID,
          added_by_name: 'Website Lead Agent',
          lead_source: 'website',
          service: businessDescription ? businessDescription.substring(0, 50) : 'Website Lead',
          source_url: referer || 'https://flodon.in',
          qualification: {
            website,
            businessDescription,
            monthlyRevenue,
            currentLeadSources,
            biggestBottleneck,
            goal90Days,
            investmentLevel,
            readyToImplement,
            decisionMaker
          }
        })
        .select()
        .single();

      if (leadError) {
        console.error('Lead insertion error:', leadError);
        return NextResponse.json({ error: 'Database error' }, { 
          status: 500,
          headers: corsHeaders
        });
      }
      leadId = newLead.id;
    }

    // Insert into calls if booking exists
    if (date && startTime && leadId) {
      const scheduledAt = new Date(`${date}T${startTime}`).toISOString();
      const { error: callError } = await supabase
        .from('calls')
        .insert({
          client_id: newLead.id,
          prospect_name: name,
          company: website || 'Website Lead',
          scheduled_at: scheduledAt,
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
    }, { 
      status: 201,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}
