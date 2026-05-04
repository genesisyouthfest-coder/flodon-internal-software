import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

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
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const { email, slotId, reason } = await request.json();

    if (!email && !slotId) {
      return NextResponse.json({ error: 'Email or slotId is required' }, { status: 400, headers: corsHeaders });
    }

    // Find the call
    let query = supabase.from('calls').update({ status: 'canceled', outcome: reason || 'Canceled by user' });
    
    if (slotId) {
      query = query.eq('slot_id', slotId);
    } else {
      const { data: client } = await supabase.from('clients').select('id').eq('email', email).single();
      if (client) {
        query = query.eq('client_id', client.id).eq('status', 'booked');
      } else {
        return NextResponse.json({ error: 'Client not found' }, { status: 404, headers: corsHeaders });
      }
    }

    const { data, error } = await query.select();

    if (error) {
      console.error('Cancellation error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500, headers: corsHeaders });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'No active booking found to cancel' }, { status: 404, headers: corsHeaders });
    }

    await supabase.from('activity_log').insert({
      action: `Call canceled for ${data[0].prospect_name}`,
      entity_type: 'call',
      entity_id: data[0].id,
      metadata: { reason }
    });

    return NextResponse.json({ success: true, message: 'Call canceled successfully' }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Cancel webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}
