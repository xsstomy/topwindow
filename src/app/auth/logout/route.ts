import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Server-side logout to reliably clear auth cookies and redirect
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.signOut()
  } catch (e) {
    // Swallow errors; still redirect below
    console.error('Server logout error:', e)
  }

  const url = new URL(request.url)
  return NextResponse.redirect(`${url.origin}/`)
}

export const dynamic = 'force-dynamic'
