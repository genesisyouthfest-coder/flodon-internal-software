import { createClient } from '@/utils/supabase/server'

export default async function AdminSidebarProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  return (
    <div className="space-y-1 overflow-hidden">
      <p className="text-xs font-bold uppercase tracking-widest leading-relaxed truncate">
        Admin Root
      </p>
      <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase opacity-80 truncate">
        {user.email}
      </p>
    </div>
  )
}

export function AdminSidebarProfileSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-3 w-24 bg-foreground/10" />
      <div className="h-2 w-32 bg-foreground/5" />
    </div>
  )
}
