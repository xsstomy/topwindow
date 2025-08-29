// 支付状态查询API
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { 
  PaymentStatusResponse,
  ApiResponse 
} from '@/types/payment'

// Edge Runtime configuration for Cloudflare compatibility
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('payment_id')

    if (!paymentId) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing payment_id parameter',
          error: { code: 'MISSING_PARAMETER' }
        } satisfies ApiResponse,
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // 获取当前认证用户
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Authentication required',
          error: { code: 'UNAUTHORIZED' }
        } satisfies ApiResponse,
        { status: 401 }
      )
    }

    // 查询支付记录
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .eq('user_id', user.id) // 确保用户只能查询自己的支付记录
      .single()

    if (paymentError || !payment) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment not found',
          error: { 
            code: 'PAYMENT_NOT_FOUND',
            details: { payment_id: paymentId }
          }
        } satisfies ApiResponse,
        { status: 404 }
      )
    }

    // 查询关联的许可证信息
    let license = null
    if (payment.status === 'completed') {
      const { data: licenseData, error: licenseError } = await supabase
        .from('licenses')
        .select('license_key, status, expires_at, activation_limit')
        .eq('payment_id', paymentId)
        .single()

      if (!licenseError && licenseData) {
        license = licenseData
      }
    }

    // 构建响应数据
    const responseData: PaymentStatusResponse = {
      status: 'success',
      message: 'Payment status retrieved successfully',
      data: {
        payment: payment,
        license: license ? {
          license_key: license.license_key,
          status: license.status,
          expires_at: license.expires_at
        } : undefined
      }
    }

    return NextResponse.json(responseData, { status: 200 })

  } catch (error) {
    console.error('Payment status query error:', error)

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to retrieve payment status',
        error: { 
          code: 'INTERNAL_ERROR',
          details: process.env.NODE_ENV === 'development' ? {
            originalError: error instanceof Error ? error.message : 'Unknown error'
          } : undefined
        }
      } satisfies ApiResponse,
      { status: 500 }
    )
  }
}

// OPTIONS 请求处理 (CORS 预检)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
