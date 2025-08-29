import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Edge Runtime configuration for Cloudflare compatibility
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // 处理 OAuth 错误
  if (error) {
    console.error('OAuth 错误:', error, errorDescription)
    const errorMessage = encodeURIComponent(errorDescription || '认证失败')
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${errorMessage}`)
  }

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('认证回调错误:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_callback_error`)
      }

      // 检查是否为新用户，如果是则创建用户资料
      if (data.user && data.session) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', data.user.id)
          .single()

        // 如果用户资料不存在，创建它
        if (!profile) {
          await supabase.from('user_profiles').insert({
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
            avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || ''
          } as any)
        }
      }
      
    } catch (error) {
      console.error('认证回调异常:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_callback_error`)
    }
  }

  // 重定向到仪表板或首页
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}