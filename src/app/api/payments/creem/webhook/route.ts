// Creem Webhook 处理器
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PaymentProviderFactory } from '@/lib/payment/providers';
import { PaymentService } from '@/lib/payment/service';
import { EmailService } from '@/lib/email/service';
import type {
  CreemWebhookEvent,
  WebhookEventData,
  ApiResponse,
} from '@/types/payment';

// Using Node.js Runtime for better TypeScript compatibility

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 获取请求体和签名
    const body = await request.text();
    const signature =
      request.headers.get('creem-signature') ||
      request.headers.get('x-creem-signature') ||
      request.headers.get('x-signature') ||
      request.headers.get('signature');

    // 记录接收到的webhook
    console.log('Creem webhook received:', {
      timestamp: new Date().toISOString(),
      hasSignature: !!signature,
      signaturePrefix: signature ? signature.substring(0, 10) + '...' : 'none',
      bodyLength: body.length,
      headers: {
        'content-type': request.headers.get('content-type'),
        'user-agent': request.headers.get('user-agent'),
      },
    });

    if (!signature) {
      console.warn('Creem webhook: Missing signature header');
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing webhook signature',
          error: { code: 'MISSING_SIGNATURE' },
        } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // 验证 Webhook 签名
    const creemProvider = PaymentProviderFactory.getProvider('creem');
    const isValidSignature = creemProvider.verifyWebhook(body, signature);

    console.log('Creem webhook signature verification:', {
      isValid: isValidSignature,
      timestamp: new Date().toISOString(),
    });

    if (!isValidSignature) {
      console.error('Creem webhook: Invalid signature', {
        receivedSignature: signature.substring(0, 20) + '...',
        bodyPreview: body.substring(0, 100) + '...',
      });
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid webhook signature',
          error: { code: 'INVALID_SIGNATURE' },
        } satisfies ApiResponse,
        { status: 403 }
      );
    }

    // 解析 Webhook 事件
    let rawEvent: any;
    try {
      rawEvent = JSON.parse(body);
    } catch (parseError) {
      console.error('Creem webhook: Invalid JSON payload:', parseError);
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid JSON payload',
          error: { code: 'INVALID_JSON' },
        } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // 记录 Webhook 事件详情
    // 兼容不同事件命名，进行标准化
    const rawType = ((rawEvent.type || rawEvent.eventType) || '').toLowerCase();
    const normalizedType =
      rawType === 'checkout.completed'
        ? 'payment.completed'
        : rawType === 'checkout.failed' || rawType === 'checkout.canceled' || rawType === 'checkout.cancelled'
        ? 'payment.failed'
        : rawType;

    // 统一数据结构
    let event: CreemWebhookEvent;
    if (rawEvent.data) {
      event = rawEvent as CreemWebhookEvent;
    } else if (rawEvent.object) {
      const obj = rawEvent.object;
      event = {
        type: normalizedType as any,
        data: {
          session_id: obj.id,
          payment_id: obj?.order?.transaction || obj?.order?.id || obj?.transaction,
          amount: obj?.order?.amount ?? obj?.amount,
          currency: obj?.order?.currency ?? obj?.currency,
          customer: {
            email: obj?.customer?.email,
            name: obj?.customer?.name,
          } as any,
          metadata: obj?.metadata ?? {},
          status: obj?.status ?? 'completed',
        } as any,
      } as unknown as CreemWebhookEvent;
    } else {
      event = { type: normalizedType as any, data: {} as any } as CreemWebhookEvent;
    }

    console.log(`Creem webhook event: ${rawEvent.type || rawEvent.eventType} (normalized: ${normalizedType})`, {
      session_id: (event as any).data?.session_id,
      payment_id: (event as any).data?.payment_id,
      metadata: (event as any).data?.metadata,
      timestamp: new Date().toISOString(),
      eventData:
        process.env.NODE_ENV === 'development' ? (event as any).data : undefined,
    });

    // 处理不同类型的事件
    switch (normalizedType) {
      case 'payment.completed':
        return await handlePaymentCompleted(event, startTime);

      case 'payment.failed':
        return await handlePaymentFailed(event, startTime);

      case 'payment.refunded':
        return await handlePaymentRefunded(event, startTime);

      default:
        console.log(`Unhandled Creem webhook event: ${event.type}`);
        return NextResponse.json(
          {
            status: 'success',
            message: `Event ${event.type} acknowledged but not processed`,
          } satisfies ApiResponse,
          { status: 200 }
        );
    }
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Creem webhook processing error:', error);

    // 记录错误到监控系统 (这里可以集成 Sentry 等)
    const errorContext = {
      provider: 'creem',
      processing_time: processingTime,
      error_message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        status: 'error',
        message: 'Webhook processing failed',
        error: {
          code: 'PROCESSING_ERROR',
          details:
            process.env.NODE_ENV === 'development' ? errorContext : undefined,
        },
      } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// 处理支付完成事件
async function handlePaymentCompleted(
  event: CreemWebhookEvent,
  startTime: number
): Promise<NextResponse> {
  try {
    const { session_id, payment_id, metadata } = event.data;

    // 通过 session_id 查找支付记录
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('provider_session_id', session_id)
      .single();

    if (paymentError || !payment) {
      console.error(`Payment not found for Creem session: ${session_id}`);
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment record not found',
          error: {
            code: 'PAYMENT_NOT_FOUND',
            details: { session_id },
          },
        } satisfies ApiResponse,
        { status: 404 }
      );
    }

    // 检查支付是否已经处理：若已完成但缺少 license，则补发；否则直接返回
    if (payment.status === 'completed') {
      try {
        const { data: existingLicense } = await supabase
          .from('licenses')
          .select('license_key')
          .eq('payment_id', payment.id)
          .single();

        if (existingLicense?.license_key) {
          console.log(
            `Payment ${payment.id} already completed with license ${existingLicense.license_key}`
          );
          return NextResponse.json(
            {
              status: 'success',
              message: 'Payment already processed',
              data: { payment_id: payment.id, license_key: existingLicense.license_key },
            } satisfies ApiResponse,
            { status: 200 }
          );
        }

        // 未找到许可证：触发补发逻辑（幂等）
        const result = await PaymentService.handlePaymentCompleted(
          payment.id,
          event.data
        );

        console.log(
          `License generated for payment ${payment.id}: ${result.licenseKey}`
        );

        return NextResponse.json(
          {
            status: 'success',
            message: 'License generated for completed payment',
            data: { payment_id: payment.id, license_key: result.licenseKey },
          } satisfies ApiResponse,
          { status: 200 }
        );
      } catch (補錯:any) {
        console.error('补发许可证失败:', 補錯);
        // 标记需要手动处理，但仍返回 200，避免重复重试风暴
        await supabase
          .from('payments')
          .update({
            metadata: {
              ...payment.metadata,
              license_generation_failed: true,
              manual_attention_required: true,
              webhook_data: event.data,
            },
          })
          .eq('id', payment.id);

        return NextResponse.json(
          {
            status: 'success',
            message: 'Payment already completed; license generation flagged for manual processing',
            data: { payment_id: payment.id },
          } satisfies ApiResponse,
          { status: 200 }
        );
      }
    }

    // 更新支付状态
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        provider_payment_id: payment_id,
        status: 'completed',
        completed_at: new Date().toISOString(),
        webhook_received_at: new Date().toISOString(),
        metadata: {
          ...payment.metadata,
          webhook_data: event.data,
          processing_started_at: new Date().toISOString(),
        },
      })
      .eq('id', payment.id);

    if (updateError) {
      throw new Error(
        `Failed to update payment status: ${updateError.message}`
      );
    }

    // 生成许可证
    let licenseKey: string | undefined;
    try {
      const licenseResult = await PaymentService.handlePaymentCompleted(
        payment.id,
        event.data
      );
      licenseKey = licenseResult.licenseKey;

      console.log(`License generated for payment ${payment.id}: ${licenseKey}`);
    } catch (licenseError) {
      console.error(
        `Failed to generate license for payment ${payment.id}:`,
        licenseError
      );

      // 标记需要手动处理
      await supabase
        .from('payments')
        .update({
          metadata: {
            ...payment.metadata,
            license_generation_failed: true,
            license_error:
              licenseError instanceof Error
                ? licenseError.message
                : 'Unknown error',
            requires_manual_processing: true,
          },
        })
        .eq('id', payment.id);

      // 发送失败通知邮件给技术团队
      await notifyTechnicalTeam('License generation failed', {
        payment_id: payment.id,
        user_id: payment.user_id,
        error:
          licenseError instanceof Error
            ? licenseError.message
            : 'Unknown error',
      });
    }

    // 邮件发送已在 LicenseService.generateLicense 内异步处理，避免重复发送

    const processingTime = Date.now() - startTime;
    console.log(
      `Creem payment completed processing finished in ${processingTime}ms`
    );

    return NextResponse.json(
      {
        status: 'success',
        message: 'Payment completed successfully',
        data: {
          payment_id: payment.id,
          license_key: licenseKey,
          processing_time: processingTime,
        },
      } satisfies ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Handle payment completed error:', error);
    throw error;
  }
}

// 处理支付失败事件
async function handlePaymentFailed(
  event: CreemWebhookEvent,
  startTime: number
): Promise<NextResponse> {
  try {
    const { session_id, reason } = event.data;

    // 查找支付记录
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('provider_session_id', session_id)
      .single();

    if (paymentError || !payment) {
      console.error(
        `Payment not found for failed Creem session: ${session_id}`
      );
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment record not found',
          error: {
            code: 'PAYMENT_NOT_FOUND',
            details: { session_id },
          },
        } satisfies ApiResponse,
        { status: 404 }
      );
    }

    // 更新支付状态为失败
    await supabase
      .from('payments')
      .update({
        status: 'failed',
        webhook_received_at: new Date().toISOString(),
        metadata: {
          ...payment.metadata,
          failure_reason: reason || 'Payment failed',
          failed_at: new Date().toISOString(),
          webhook_data: event.data,
        },
      })
      .eq('id', payment.id);

    // 发送支付失败通知邮件
    try {
      await EmailService.sendPaymentFailureEmail({
        userEmail: payment.customer_info.email,
        userName: payment.customer_info.name || payment.customer_info.email,
        reason: reason || 'Payment processing failed',
        retryUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      });

      console.log(`Payment failure email sent for payment ${payment.id}`);
    } catch (emailError) {
      console.error(
        `Failed to send payment failure email for payment ${payment.id}:`,
        emailError
      );
    }

    const processingTime = Date.now() - startTime;
    console.log(
      `Creem payment failed processing finished in ${processingTime}ms`
    );

    return NextResponse.json(
      {
        status: 'success',
        message: 'Payment failure processed',
        data: {
          payment_id: payment.id,
          reason: reason || 'Payment failed',
          processing_time: processingTime,
        },
      } satisfies ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Handle payment failed error:', error);
    throw error;
  }
}

// 处理支付退款事件
async function handlePaymentRefunded(
  event: CreemWebhookEvent,
  startTime: number
): Promise<NextResponse> {
  try {
    const { session_id, payment_id } = event.data;

    // 查找支付记录
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('provider_session_id', session_id)
      .single();

    if (paymentError || !payment) {
      console.error(
        `Payment not found for refunded Creem session: ${session_id}`
      );
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment record not found',
          error: {
            code: 'PAYMENT_NOT_FOUND',
            details: { session_id },
          },
        } satisfies ApiResponse,
        { status: 404 }
      );
    }

    // 更新支付状态为已退款
    await supabase
      .from('payments')
      .update({
        status: 'refunded',
        webhook_received_at: new Date().toISOString(),
        metadata: {
          ...payment.metadata,
          refunded_at: new Date().toISOString(),
          webhook_data: event.data,
        },
      })
      .eq('id', payment.id);

    // 撤销相关的许可证
    const { error: licenseError } = await supabase
      .from('licenses')
      .update({
        status: 'revoked',
        metadata: {
          revoked_reason: 'payment_refunded',
          revoked_at: new Date().toISOString(),
        },
      })
      .eq('payment_id', payment.id);

    if (licenseError) {
      console.error(
        `Failed to revoke license for refunded payment ${payment.id}:`,
        licenseError
      );
    }

    const processingTime = Date.now() - startTime;
    console.log(
      `Creem payment refunded processing finished in ${processingTime}ms`
    );

    return NextResponse.json(
      {
        status: 'success',
        message: 'Payment refund processed',
        data: {
          payment_id: payment.id,
          processing_time: processingTime,
        },
      } satisfies ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Handle payment refunded error:', error);
    throw error;
  }
}

// 通知技术团队 (内部函数)
async function notifyTechnicalTeam(
  subject: string,
  details: any
): Promise<void> {
  try {
    const supportEmail = process.env.SUPPORT_EMAIL || 'xsstomy@gmail.com';

    // 这里可以发送邮件给技术团队
    // 暂时只记录日志
    console.warn(`TECHNICAL ALERT: ${subject}`, details);

    // 在生产环境中，这里应该发送实际的通知邮件
    // await EmailService.sendTechnicalAlert(supportEmail, subject, details)
  } catch (error) {
    console.error('Failed to notify technical team:', error);
  }
}

// 健康检查端点
export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Creem webhook endpoint is healthy',
    data: {
      endpoint: 'creem-webhook',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
  } satisfies ApiResponse);
}

// TESTING-GUIDE: 需覆盖用例
// 1. 支付完成处理 - 成功生成许可证和发送邮件
// 2. 支付失败处理 - 正确更新状态和发送通知
// 3. 支付退款处理 - 撤销许可证和更新状态
// 4. 签名验证 - 有效/无效签名的处理
// 5. 重复事件处理 - 幂等性验证
// 6. 错误恢复 - 许可证生成失败的处理
// 7. 邮件发送失败 - 不影响主流程的错误处理
