// 支付会话创建API
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { PaymentService } from '@/lib/payment/service'
import { rateLimit } from '@/lib/utils/validators'
import type { 
  CreateSessionParams, 
  CreateSessionResponse,
  ApiResponse 
} from '@/types/payment'

export async function POST(request: NextRequest) {
  try {
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

    // 获取当前认证用户
    const supabase = createRouteHandlerClient({ cookies })
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

    // 创建支付记录并获取支付会话
    const sessionParams: CreateSessionParams = {
      provider,
      product_id,
      success_url,
      cancel_url,
      customer_email: customer_email || user.email || '',
      customer_name: user.user_metadata?.full_name || user.email?.split('@')[0]
    }

    // 为支付记录添加用户信息
    const paymentData = {
      user_id: user.id,
      payment_provider: provider,
      amount: product.price,
      currency: product.currency,
      status: 'pending' as const,
      product_info: {
        product_id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        features: product.features
      },
      customer_info: {
        email: sessionParams.customer_email,
        name: sessionParams.customer_name,
        user_id: user.id
      },
      metadata: {
        created_via: 'api',
        user_agent: userAgent,
        ip_address: clientIP,
        session_requested_at: new Date().toISOString()
      }
    }

    // 插入支付记录
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single()

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError)
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to create payment record',
          error: { 
            code: 'DATABASE_ERROR',
            details: { message: paymentError.message }
          }
        } satisfies ApiResponse,
        { status: 500 }
      )
    }

    // 创建支付会话
    const sessionResult = await PaymentService.createPaymentSession(sessionParams)

    // 更新支付记录的会话信息
    await supabase
      .from('payments')
      .update({
        provider_session_id: sessionResult.session_id,
        metadata: {
          ...payment.metadata,
          session_created_at: new Date().toISOString(),
          session_url: sessionResult.session_url
        }
      })
      .eq('id', payment.id)

    // 记录成功创建的日志
    console.log(`Payment session created successfully:`, {
      payment_id: payment.id,
      session_id: sessionResult.session_id,
      provider,
      user_id: user.id,
      product_id
    })

    // 返回成功响应
    const response: CreateSessionResponse = {
      status: 'success',
      message: 'Payment session created successfully',
      data: {
        payment_id: payment.id,
        session_url: sessionResult.session_url,
        session_id: sessionResult.session_id,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30分钟后过期
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Create payment session error:', error)

    // 根据错误类型返回不同的响应
    let statusCode = 500
    let errorCode = 'INTERNAL_ERROR'
    let errorMessage = 'An unexpected error occurred'

    if (error.message?.includes('payment provider')) {
      statusCode = 400
      errorCode = 'PROVIDER_ERROR'
      errorMessage = 'Payment provider error'
    } else if (error.message?.includes('validation')) {
      statusCode = 400
      errorCode = 'VALIDATION_ERROR'
      errorMessage = 'Invalid request parameters'
    } else if (error.message?.includes('network')) {
      statusCode = 503
      errorCode = 'SERVICE_UNAVAILABLE'
      errorMessage = 'Payment service temporarily unavailable'
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