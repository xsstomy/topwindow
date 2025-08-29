// Paddle Webhook 处理器
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PaymentProviderFactory } from '@/lib/payment/providers'
import { PaymentService } from '@/lib/payment/service'
import { EmailService } from '@/lib/email/service'
import type { 
  PaddleWebhookEvent,
  WebhookEventData,
  ApiResponse
} from '@/types/payment'

// Using Node.js Runtime for better TypeScript compatibility

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // 获取请求体和签名
    const body = await request.text()
    const signature = request.headers.get('paddle-signature')

    if (!signature) {
      console.warn('Paddle webhook: Missing signature header')
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing webhook signature',
          error: { code: 'MISSING_SIGNATURE' }
        } satisfies ApiResponse,
        { status: 400 }
      )
    }

    // 验证 Webhook 签名
    const paddleProvider = PaymentProviderFactory.getProvider('paddle')
    const isValidSignature = paddleProvider.verifyWebhook(body, signature)

    if (!isValidSignature) {
      console.error('Paddle webhook: Invalid signature')
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid webhook signature',
          error: { code: 'INVALID_SIGNATURE' }
        } satisfies ApiResponse,
        { status: 403 }
      )
    }

    // 解析 Webhook 事件
    let event: PaddleWebhookEvent
    try {
      event = JSON.parse(body)
    } catch (parseError) {
      console.error('Paddle webhook: Invalid JSON payload:', parseError)
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid JSON payload',
          error: { code: 'INVALID_JSON' }
        } satisfies ApiResponse,
        { status: 400 }
      )
    }

    // 记录 Webhook 接收日志
    console.log(`Paddle webhook received: ${event.event_type}`, {
      transaction_id: event.data.id,
      custom_data: event.data.custom_data,
      timestamp: new Date().toISOString()
    })

    // 处理不同类型的事件
    switch (event.event_type) {
      case 'transaction.completed':
        return await handleTransactionCompleted(event, startTime)
      
      case 'transaction.updated':
        return await handleTransactionUpdated(event, startTime)
      
      case 'transaction.cancelled':
        return await handleTransactionCancelled(event, startTime)
      
      default:
        console.log(`Unhandled Paddle webhook event: ${event.event_type}`)
        return NextResponse.json(
          {
            status: 'success',
            message: `Event ${event.event_type} acknowledged but not processed`
          } satisfies ApiResponse,
          { status: 200 }
        )
    }

  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error('Paddle webhook processing error:', error)

    // 记录错误到监控系统
    const errorContext = {
      provider: 'paddle',
      processing_time: processingTime,
      error_message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(
      {
        status: 'error',
        message: 'Webhook processing failed',
        error: { 
          code: 'PROCESSING_ERROR',
          details: process.env.NODE_ENV === 'development' ? errorContext : undefined
        }
      } satisfies ApiResponse,
      { status: 500 }
    )
  }
}

// 处理交易完成事件
async function handleTransactionCompleted(
  event: PaddleWebhookEvent, 
  startTime: number
): Promise<NextResponse> {
  try {
    const { id, status, amount, currency_code, custom_data } = event.data
    const paymentId = custom_data.payment_id

    if (!paymentId) {
      console.error('Paddle transaction missing payment_id in custom_data:', custom_data)
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing payment_id in transaction data',
          error: { 
            code: 'MISSING_PAYMENT_ID',
            details: { transaction_id: id }
          }
        } satisfies ApiResponse,
        { status: 400 }
      )
    }

    // 查找支付记录
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single()

    if (paymentError || !payment) {
      console.error(`Payment not found for Paddle transaction: ${id}, payment_id: ${paymentId}`)
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment record not found',
          error: { 
            code: 'PAYMENT_NOT_FOUND',
            details: { transaction_id: id, payment_id: paymentId }
          }
        } satisfies ApiResponse,
        { status: 404 }
      )
    }

    // 检查支付是否已经处理
    if (payment.status === 'completed') {
      console.log(`Payment ${payment.id} already completed, skipping`)
      return NextResponse.json(
        {
          status: 'success',
          message: 'Payment already processed'
        } satisfies ApiResponse,
        { status: 200 }
      )
    }

    // 验证交易金额 (Paddle 使用字符串格式的金额)
    const transactionAmount = parseFloat(amount)
    const expectedAmount = payment.amount
    const amountTolerance = 0.01 // 1分的误差容忍度

    if (Math.abs(transactionAmount - expectedAmount) > amountTolerance) {
      console.error(`Amount mismatch for payment ${paymentId}: expected ${expectedAmount}, got ${transactionAmount}`)
      
      await supabase
        .from('payments')
        .update({
          status: 'failed',
          metadata: {
            ...payment.metadata,
            amount_mismatch: true,
            expected_amount: expectedAmount,
            received_amount: transactionAmount,
            webhook_data: event.data
          }
        })
        .eq('id', paymentId)

      return NextResponse.json(
        {
          status: 'error',
          message: 'Transaction amount mismatch',
          error: { 
            code: 'AMOUNT_MISMATCH',
            details: { 
              expected: expectedAmount, 
              received: transactionAmount 
            }
          }
        } satisfies ApiResponse,
        { status: 400 }
      )
    }

    // 更新支付状态
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        provider_payment_id: id,
        status: 'completed',
        completed_at: new Date().toISOString(),
        webhook_received_at: new Date().toISOString(),
        metadata: {
          ...payment.metadata,
          webhook_data: event.data,
          processing_started_at: new Date().toISOString(),
          paddle_transaction_id: id
        }
      })
      .eq('id', paymentId)

    if (updateError) {
      throw new Error(`Failed to update payment status: ${updateError.message}`)
    }

    // 生成许可证
    let licenseKey: string | undefined
    try {
      const licenseResult = await PaymentService.handlePaymentCompleted(paymentId, event.data)
      licenseKey = licenseResult.licenseKey

      console.log(`License generated for Paddle payment ${paymentId}: ${licenseKey}`)
    } catch (licenseError) {
      console.error(`Failed to generate license for Paddle payment ${paymentId}:`, licenseError)
      
      // 标记需要手动处理
      await supabase
        .from('payments')
        .update({
          metadata: {
            ...payment.metadata,
            license_generation_failed: true,
            license_error: licenseError instanceof Error ? licenseError.message : 'Unknown error',
            requires_manual_processing: true
          }
        })
        .eq('id', paymentId)

      // 发送失败通知邮件给技术团队
      await notifyTechnicalTeam('Paddle license generation failed', {
        payment_id: paymentId,
        transaction_id: id,
        user_id: payment.user_id,
        error: licenseError instanceof Error ? licenseError.message : 'Unknown error'
      })
    }

    // 发送许可证邮件 (如果许可证生成成功)
    if (licenseKey) {
      try {
        await EmailService.sendLicenseEmail({
          userEmail: payment.customer_info.email,
          userName: payment.customer_info.name || payment.customer_info.email,
          licenseKey,
          productName: payment.product_info.name,
          activationLimit: 1 // 从产品配置获取
        })

        console.log(`License email sent for Paddle payment ${paymentId}`)
      } catch (emailError) {
        console.error(`Failed to send license email for Paddle payment ${paymentId}:`, emailError)
        
        // 邮件发送失败不应阻止 Webhook 成功响应
        await supabase
          .from('payments')
          .update({
            metadata: {
              ...payment.metadata,
              email_send_failed: true,
              email_error: emailError instanceof Error ? emailError.message : 'Unknown error'
            }
          })
          .eq('id', paymentId)
      }
    }

    const processingTime = Date.now() - startTime
    console.log(`Paddle transaction completed processing finished in ${processingTime}ms`)

    return NextResponse.json(
      {
        status: 'success',
        message: 'Transaction completed successfully',
        data: {
          payment_id: paymentId,
          transaction_id: id,
          license_key: licenseKey,
          processing_time: processingTime
        }
      } satisfies ApiResponse,
      { status: 200 }
    )

  } catch (error) {
    console.error('Handle transaction completed error:', error)
    throw error
  }
}

// 处理交易更新事件
async function handleTransactionUpdated(
  event: PaddleWebhookEvent, 
  startTime: number
): Promise<NextResponse> {
  try {
    const { id, status, custom_data } = event.data
    const paymentId = custom_data.payment_id

    if (!paymentId) {
      console.error('Paddle transaction update missing payment_id:', custom_data)
      return NextResponse.json(
        {
          status: 'success',
          message: 'Transaction update acknowledged (no payment_id)'
        } satisfies ApiResponse,
        { status: 200 }
      )
    }

    // 查找支付记录
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single()

    if (paymentError || !payment) {
      console.warn(`Payment not found for Paddle transaction update: ${id}, payment_id: ${paymentId}`)
      return NextResponse.json(
        {
          status: 'success',
          message: 'Transaction update acknowledged (payment not found)'
        } satisfies ApiResponse,
        { status: 200 }
      )
    }

    // 更新支付记录的元数据
    await supabase
      .from('payments')
      .update({
        metadata: {
          ...payment.metadata,
          last_paddle_update: new Date().toISOString(),
          latest_status: status,
          webhook_data: event.data
        }
      })
      .eq('id', paymentId)

    // 根据状态决定是否需要进一步处理
    if (status === 'completed' && payment.status !== 'completed') {
      // 如果这是一个延迟完成的交易，调用完成处理逻辑
      return await handleTransactionCompleted(event, startTime)
    }

    const processingTime = Date.now() - startTime
    console.log(`Paddle transaction updated processing finished in ${processingTime}ms`)

    return NextResponse.json(
      {
        status: 'success',
        message: 'Transaction update processed',
        data: {
          payment_id: paymentId,
          transaction_id: id,
          status,
          processing_time: processingTime
        }
      } satisfies ApiResponse,
      { status: 200 }
    )

  } catch (error) {
    console.error('Handle transaction updated error:', error)
    throw error
  }
}

// 处理交易取消事件
async function handleTransactionCancelled(
  event: PaddleWebhookEvent, 
  startTime: number
): Promise<NextResponse> {
  try {
    const { id, custom_data } = event.data
    const paymentId = custom_data.payment_id

    if (!paymentId) {
      console.error('Paddle transaction cancellation missing payment_id:', custom_data)
      return NextResponse.json(
        {
          status: 'success',
          message: 'Transaction cancellation acknowledged (no payment_id)'
        } satisfies ApiResponse,
        { status: 200 }
      )
    }

    // 查找支付记录
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single()

    if (paymentError || !payment) {
      console.warn(`Payment not found for Paddle transaction cancellation: ${id}, payment_id: ${paymentId}`)
      return NextResponse.json(
        {
          status: 'success',
          message: 'Transaction cancellation acknowledged (payment not found)'
        } satisfies ApiResponse,
        { status: 200 }
      )
    }

    // 更新支付状态为已取消
    await supabase
      .from('payments')
      .update({
        status: 'cancelled',
        webhook_received_at: new Date().toISOString(),
        metadata: {
          ...payment.metadata,
          cancelled_at: new Date().toISOString(),
          webhook_data: event.data,
          paddle_transaction_id: id
        }
      })
      .eq('id', paymentId)

    // 如果已经生成了许可证，需要撤销
    const { error: licenseError } = await supabase
      .from('licenses')
      .update({
        status: 'revoked',
        metadata: {
          revoked_reason: 'payment_cancelled',
          revoked_at: new Date().toISOString()
        }
      })
      .eq('payment_id', paymentId)

    if (licenseError) {
      console.error(`Failed to revoke license for cancelled Paddle payment ${paymentId}:`, licenseError)
    }

    // 发送支付取消通知邮件
    try {
      await EmailService.sendPaymentFailureEmail({
        userEmail: payment.customer_info.email,
        userName: payment.customer_info.name || payment.customer_info.email,
        reason: 'Payment was cancelled',
        retryUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
      })

      console.log(`Payment cancellation email sent for Paddle payment ${paymentId}`)
    } catch (emailError) {
      console.error(`Failed to send cancellation email for Paddle payment ${paymentId}:`, emailError)
    }

    const processingTime = Date.now() - startTime
    console.log(`Paddle transaction cancelled processing finished in ${processingTime}ms`)

    return NextResponse.json(
      {
        status: 'success',
        message: 'Transaction cancellation processed',
        data: {
          payment_id: paymentId,
          transaction_id: id,
          processing_time: processingTime
        }
      } satisfies ApiResponse,
      { status: 200 }
    )

  } catch (error) {
    console.error('Handle transaction cancelled error:', error)
    throw error
  }
}

// 通知技术团队 (内部函数)
async function notifyTechnicalTeam(subject: string, details: any): Promise<void> {
  try {
    const supportEmail = process.env.SUPPORT_EMAIL || 'support@topwindow.app'
    
    // 这里可以发送邮件给技术团队
    // 暂时只记录日志
    console.warn(`TECHNICAL ALERT: ${subject}`, details)
    
    // 在生产环境中，这里应该发送实际的通知邮件
    // await EmailService.sendTechnicalAlert(supportEmail, subject, details)
    
  } catch (error) {
    console.error('Failed to notify technical team:', error)
  }
}

// 健康检查端点
export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Paddle webhook endpoint is healthy',
    data: {
      endpoint: 'paddle-webhook',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  } satisfies ApiResponse)
}

// TESTING-GUIDE: 需覆盖用例
// 1. 交易完成处理 - 成功生成许可证和发送邮件
// 2. 交易更新处理 - 正确更新元数据和状态
// 3. 交易取消处理 - 撤销许可证和发送通知
// 4. 签名验证 - 有效/无效签名的处理
// 5. 金额验证 - 交易金额与预期金额的匹配
// 6. 重复事件处理 - 幂等性验证
// 7. 缺失payment_id处理 - 优雅处理不完整的数据
