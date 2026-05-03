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
  const agentId = '7b85a531-3af2-4cea-8d75-c663eb98eff2'
  
  console.log('--- DIAGNOSTIC START ---')
  
  // 1. Check if Agent exists
  const { data: agent, error: agentError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', agentId)
    .single()
    
  if (agentError) {
    console.log('❌ Agent not found in profiles table:', agentError.message)
  } else {
    console.log('✅ Agent found:', agent.full_name)
  }

  // 2. Try a minimal insert to see the exact error
  const { error: insertError } = await supabase
    .from('clients')
    .insert({
      name: 'Diagnostic Test',
      email: `test-${Date.now()}@flodon.in`,
      added_by: agentId,
      added_by_name: 'Website Lead Agent',
      service: 'Diagnostic',
      lead_source: 'website'
    })
    
  if (insertError) {
    console.log('❌ Insert failed. Exact Supabase error:')
    console.log(JSON.stringify(insertError, null, 2))
  } else {
    console.log('✅ Minimal insert succeeded!')
  }
}

diagnostic()
