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

async function diagnostic() {
  console.log('--- CALLS DIAGNOSTIC START ---')
  
  // Try to find a call for jane@example.com
  const { data: client } = await supabase.from('clients').select('id').eq('email', 'jane@example.com').single();
  
  if (!client) {
    console.log('❌ Client jane@example.com not found. Create a lead first!')
    return
  }

  console.log('✅ Client found ID:', client.id)

  // Try the update and capture the raw error
  const { error: updateError } = await supabase
    .from('calls')
    .update({ 
      status: 'cancelled', 
      outcome: 'Diagnostic Test' 
    })
    .eq('client_id', client.id)
    .eq('status', 'booked')
    
  if (updateError) {
    console.log('❌ Update failed. Exact error:')
    console.log(JSON.stringify(updateError, null, 2))
  } else {
    console.log('✅ Update simulation succeeded!')
  }
}

diagnostic()
