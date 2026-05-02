import { createClient } from '@/utils/supabase/server'
import { Suspense } from 'react'

export default async function SidebarProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-1 overflow-hidden">
      <p className="text-xs font-bold uppercase tracking-widest leading-relaxed truncate">
        {profile?.full_name || 'Agent'}
      </p>
      <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase opacity-80 truncate">
        {profile?.email}
      </p>
    </div>
  )
}

export function SidebarProfileSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-3 w-24 bg-foreground/10" />
      <div className="h-2 w-32 bg-foreground/5" />
    </div>
  )
}
