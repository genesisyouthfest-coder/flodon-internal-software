import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing env variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function checkBookings() {
  const email = 'jane@example.com'
  console.log(`--- CHECKING BOOKINGS FOR ${email} ---`)
  
  // 1. Find client
  const { data: client } = await supabase.from('clients').select('id, name').eq('email', email).single()
  
  if (!client) {
    console.log('❌ Client not found in clients table.')
    return
  }
  console.log(`✅ Client found: ${client.name} (${client.id})`)

  // 2. Find all calls for this client
  const { data: calls, error: callsError } = await supabase
    .from('calls')
    .select('*')
    .eq('client_id', client.id)
    
  if (callsError) {
    console.log('❌ Error fetching calls:', callsError.message)
    return
  }

  if (calls.length === 0) {
    console.log('❌ No records found in the "calls" table for this client.')
  } else {
    console.log(`✅ Found ${calls.length} call records:`)
    calls.forEach((c, i) => {
      console.log(`${i+1}. Status: [${c.status}] | Scheduled: ${c.scheduled_at}`)
    })
  }
}

checkBookings()
