'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSmtpConnection() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.log("No user found in getSmtpConnection")
    return null
  }

  // Use limit(1) to prevent 'multiple rows' errors if the table lacks a strict unique constraint.
  const { data: connections, error } = await supabase
    .from('email_connections')
    .select('*')
    .eq('user_id', user.id)
    .order('connected_at', { ascending: false })
    .limit(1)

  if (error) {
    console.log("Supabase error fetching connection:", error.message)
  }

  const connection = connections?.[0]

  if (!connection) {
    console.log("No connection record found for user:", user.id)
    return null
  }

  if (connection.provider !== 'smtp' || !connection.access_token) {
    console.log("Connection found but provider/token missing or incorrect")
    return null
  }

  try {
    const config = JSON.parse(Buffer.from(connection.access_token, 'base64').toString('utf-8'))
    console.log("Connection Decrypted Successfully for:", config.user)
    return config
  } catch (e) {
    console.log("Failed to parse access_token JSON")
    return null
  }
}


export async function saveSmtpConnection(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const config = {
    host: formData.get('host') as string,
    port: formData.get('port') as string,
    user: formData.get('user') as string,
    password: (formData.get('password') as string).replace(/\s+/g, ''),
    displayName: formData.get('displayName') as string || 'Flodon Agent'
  }

  // Base64 encode the config for storage (consistent with existing logic)
  const accessToken = Buffer.from(JSON.stringify(config)).toString('base64')

  const { error } = await supabase
    .from('email_connections')
    .upsert({
      user_id: user.id,
      provider: 'smtp',
      access_token: accessToken,
      connected_at: new Date().toISOString()
    })

  if (error) {
    console.error("UPSERT ERROR:", error)
    return { error: error.message }
  }

  console.log("Saved config successfully for:", user.id)
  revalidatePath('/dashboard/sales/email')
  return { success: true }
}

