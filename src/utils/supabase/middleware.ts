import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  
  if (request.nextUrl.pathname === '/') {
    if (!user) {
      url.pathname = '/login'
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      
      const isAdmin = profile?.is_admin || user.email === 'admin@flodon.in'
      url.pathname = isAdmin ? '/admin' : '/dashboard/sales/clients'
    }
    return NextResponse.redirect(url)
  }

  if (
    !user &&
    (request.nextUrl.pathname.startsWith('/dashboard') || 
     request.nextUrl.pathname.startsWith('/admin'))
  ) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    // SECURITY: Verify if account is suspended
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', user.id)
      .single()

    if (profile && profile.is_active === false) {
      // Invalidate session
      await supabase.auth.signOut()
      url.pathname = '/login'
      url.searchParams.set('error', 'ACCOUNT SUSPENDED: ACCESS REVOKED')
      return NextResponse.redirect(url)
    }

    // Check if user is admin
    const { data: profileData } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    const isAdmin = profileData?.is_admin || user.email === 'admin@flodon.in'

    if (isAdmin && request.nextUrl.pathname.startsWith('/dashboard')) {
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }

    if (!isAdmin && request.nextUrl.pathname.startsWith('/admin')) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    
    // Redirect to sales clients if on base dashboard
    if (!isAdmin && request.nextUrl.pathname === '/dashboard') {
      url.pathname = '/dashboard/sales/clients'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
