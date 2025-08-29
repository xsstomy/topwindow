// Mock webhook 端点用于测试支付成功流程
import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/payment/service'
import type { ApiResponse } from '@/types/payment'

// Edge Runtime configuration for Cloudflare compatibility
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    // 只在开发环境启用
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Mock webhook only available in development',
          error: { code: 'NOT_AVAILABLE' }
        } satisfies ApiResponse,
        { status: 403 }
      )
    }

    const body = await request.json()
    const { payment_id, action = 'complete' } = body

    if (!payment_id) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing payment_id parameter',
          error: { code: 'MISSING_PARAMETER' }
        } satisfies ApiResponse,
        { status: 400 }
      )
    }

    console.log(`[MOCK WEBHOOK] Processing ${action} for payment: ${payment_id}`)

    if (action === 'complete') {
      // 模拟支付成功的 webhook 数据
      const mockWebhookData = {
        id: `mock_${Date.now()}`,
        payment_id: payment_id,
        status: 'completed',
        amount: 2999,
        currency: 'USD',
        created_at: new Date().toISOString(),
        provider: 'creem',
        test_mode: true
      }

      // 调用支付完成处理逻辑
      const result = await PaymentService.handlePaymentCompleted(payment_id, mockWebhookData)

      console.log(`[MOCK WEBHOOK] Payment completion result:`, result)

      return NextResponse.json(
        {
          status: 'success',
          message: 'Mock payment completion processed',
          data: {
            payment_id,
            result,
            mock_webhook_data: mockWebhookData
          }
        } satisfies ApiResponse,
        { status: 200 }
      )
    } else if (action === 'fail') {
      // 模拟支付失败
      await PaymentService.handlePaymentFailed(payment_id, 'Mock payment failure for testing')

      return NextResponse.json(
        {
          status: 'success',
          message: 'Mock payment failure processed',
          data: {
            payment_id,
            action: 'failed'
          }
        } satisfies ApiResponse,
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid action. Use "complete" or "fail"',
          error: { code: 'INVALID_ACTION' }
        } satisfies ApiResponse,
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('[MOCK WEBHOOK] Error:', error)

    return NextResponse.json(
      {
        status: 'error',
        message: 'Mock webhook processing failed',
        error: { 
          code: 'INTERNAL_ERROR',
          details: process.env.NODE_ENV === 'development' ? {
            originalError: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace'
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// GET 请求显示使用说明
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'info',
    message: 'Mock webhook endpoint for testing payment flows',
    usage: {
      method: 'POST',
      body: {
        payment_id: 'string (required)',
        action: 'string (optional, default: "complete", options: "complete" | "fail")'
      },
      examples: {
        complete_payment: {
          payment_id: 'your-payment-id',
          action: 'complete'
        },
        fail_payment: {
          payment_id: 'your-payment-id', 
          action: 'fail'
        }
      }
    },
    environment: process.env.NODE_ENV
  }, { status: 200 })
}

// TESTING-GUIDE: Mock Webhook 测试用例
// 1. 支付成功完成 - 验证状态更新和许可证生成
// 2. 支付失败处理 - 验证失败状态更新
// 3. 重复处理 - 防止重复完成同一支付
// 4. 错误参数 - 缺失或无效的 payment_id
// 5. 环境限制 - 非开发环境的访问控制
