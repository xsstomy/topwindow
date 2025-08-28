// 支付会话创建API
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { PaymentService } from '@/lib/payment/service'
import { rateLimit } from '@/lib/utils/validators'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { 
  CreateSessionParams, 
  CreateSessionResponse,
  ApiResponse 
} from '@/types/payment'

export async function POST(request: NextRequest) {
  try {
    // 检查支付处理是否启用
    if (process.env.ENABLE_PAYMENT_PROCESSING !== 'true') {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment processing is currently disabled',
          error: { 
            code: 'PAYMENT_DISABLED',
            details: { 
              enabled: process.env.ENABLE_PAYMENT_PROCESSING,
              message: 'Please enable payment processing in environment variables' 
            }
          }
        } satisfies ApiResponse,
        { status: 503 }
      )
    }

    // 获取客户端IP和用户代理
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // API 限流检查
    const rateLimitKey = `create-session:${clientIP}`
    if (!rateLimit(rateLimitKey, 5, 60000)) { // 5次/分钟
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Too many requests, please try again later.',
          error: { code: 'RATE_LIMIT_EXCEEDED' }
        } satisfies ApiResponse,
        { status: 429 }
      )
    }

    // 解析请求参数
    const body = await request.json()
    const { 
      provider, 
      product_id, 
      success_url, 
      cancel_url, 
      customer_email 
    }: CreateSessionParams = body

    // 基础参数验证
    if (!provider || !product_id || !success_url || !cancel_url) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing required parameters',
          error: { 
            code: 'VALIDATION_ERROR',
            details: {
              required: ['provider', 'product_id', 'success_url', 'cancel_url']
            }
          }
        } satisfies ApiResponse,
        { status: 400 }
      )
    }

    // 验证支付平台
    if (!['creem', 'paddle'].includes(provider)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Unsupported payment provider',
          error: { 
            code: 'INVALID_PROVIDER',
            details: { provider, supported: ['creem', 'paddle'] }
          }
        } satisfies ApiResponse,
        { status: 400 }
      )
    }

    // 获取当前认证用户 (用于身份验证)
    const authSupabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await authSupabase.auth.getUser()
    
    // 使用服务角色客户端进行数据库操作 (绕过 RLS)
    const supabase = supabaseAdmin

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

    // 验证产品存在性和有效性
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', product_id)
      .eq('is_active', true)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Product not found or inactive',
          error: { 
            code: 'PRODUCT_NOT_FOUND',
            details: { product_id }
          }
        } satisfies ApiResponse,
        { status: 404 }
      )
    }

    // 检查用户是否已有该产品的有效许可证
    const { data: existingLicense } = await supabase
      .from('licenses')
      .select('license_key, status, expires_at')
      .eq('user_id', user.id)
      .eq('product_id', product_id)
      .in('status', ['active'])
      .single()

    if (existingLicense) {
      // 检查许可证是否过期
      const isExpired = existingLicense.expires_at && 
        new Date(existingLicense.expires_at) < new Date()

      if (!isExpired) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'You already have an active license for this product',
            error: { 
              code: 'LICENSE_ALREADY_EXISTS',
              details: { 
                license_key: existingLicense.license_key,
                status: existingLicense.status
              }
            }
          } satisfies ApiResponse,
          { status: 409 }
        )
      }
    }

    // 创建支付会话（包含用户信息）
    const sessionParams = {
      provider,
      product_id,
      success_url,
      cancel_url,
      customer_email: customer_email || user.email || '',
      customer_name: user.user_metadata?.full_name || user.email?.split('@')[0],
      user_id: user.id
    }

    // 创建支付会话（这会自动创建支付记录）
    const sessionResult = await PaymentService.createPaymentSession(sessionParams)

    // 记录成功创建的日志
    console.log(`Payment session created successfully:`, {
      payment_id: sessionResult.payment_id,
      session_id: sessionResult.session_id,
      session_url: sessionResult.session_url,
      provider,
      user_id: user.id,
      product_id
    })

    // 返回成功响应
    const response: CreateSessionResponse = {
      status: 'success',
      message: 'Payment session created successfully',
      data: {
        payment_id: sessionResult.payment_id,
        session_url: sessionResult.session_url,
        session_id: sessionResult.session_id,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30分钟后过期
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    // 详细的错误日志记录
    console.error('=== Create payment session error ===')
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Error details:', {
      name: error.name,
      cause: error.cause,
      timestamp: new Date().toISOString()
    })
    console.error('=====================================')

    // 根据错误类型返回不同的响应
    let statusCode = 500
    let errorCode = 'INTERNAL_ERROR'
    let errorMessage = 'An unexpected error occurred'

    // 更具体的错误处理
    if (error.message?.includes('Product not found')) {
      statusCode = 404
      errorCode = 'PRODUCT_NOT_FOUND'
      errorMessage = 'Product not found or inactive'
    } else if (error.message?.includes('payment provider')) {
      statusCode = 400
      errorCode = 'PROVIDER_ERROR'
      errorMessage = 'Payment provider error'
    } else if (error.message?.includes('validation') || error.message?.includes('required')) {
      statusCode = 400
      errorCode = 'VALIDATION_ERROR'
      errorMessage = 'Invalid request parameters'
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      statusCode = 503
      errorCode = 'SERVICE_UNAVAILABLE'
      errorMessage = 'Payment service temporarily unavailable'
    } else if (error.message?.includes('Database') || error.message?.includes('Supabase')) {
      statusCode = 503
      errorCode = 'DATABASE_ERROR'
      errorMessage = 'Database connection error'
    }

    return NextResponse.json(
      {
        status: 'error',
        message: errorMessage,
        error: { 
          code: errorCode,
          details: process.env.NODE_ENV === 'development' ? {
            originalError: error.message,
            stack: error.stack
          } : undefined
        }
      } satisfies ApiResponse,
      { status: statusCode }
    )
  }
}

// 健康检查端点
export async function GET(request: NextRequest) {
  try {
    // 检查支付平台健康状态
    const healthChecks = {
      creem: { isHealthy: true, message: 'Provider available' },
      paddle: { isHealthy: true, message: 'Provider available' }
    }

    // 在真实环境中，这里可以检查支付平台的连通性
    // 目前返回基础的健康状态

    return NextResponse.json({
      status: 'success',
      message: 'Payment service is healthy',
      data: {
        service: 'payment-sessions',
        version: '1.0.0',
        uptime: process.uptime(),
        providers: healthChecks,
        timestamp: new Date().toISOString()
      }
    } satisfies ApiResponse)

  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: { 
          code: 'HEALTH_CHECK_FAILED',
          details: { message: error.message }
        }
      } satisfies ApiResponse,
      { status: 503 }
    )
  }
}

// OPTIONS 请求处理 (CORS 预检)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// TESTING-GUIDE: 需覆盖用例
// 1. 成功创建支付会话 - 正常流程测试
// 2. 参数验证失败 - 缺失/无效参数处理
// 3. 用户认证失败 - 未登录用户访问
// 4. 产品验证失败 - 不存在/已停用产品
// 5. 重复许可证检查 - 已有有效许可证的用户
// 6. 限流保护测试 - 超出频次限制
// 7. 支付平台错误 - 外部服务不可用
// 8. 数据库错误处理 - 写入失败恢复