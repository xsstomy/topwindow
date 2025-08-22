// 支付平台适配器实现
import crypto from 'crypto'
import type { 
  PaymentProviderInterface,
  CreateSessionParams,
  SessionResult,
  WebhookEventData,
  WebhookProcessResult,
  PaymentRecord,
  CreemSessionParams,
  CreemSessionResponse,
  CreemWebhookEvent,
  PaddleSessionParams,
  PaddleSessionResponse,
  PaddleWebhookEvent,
  PaymentErrorType
} from '@/types/payment'

// 抽象支付平台类
abstract class PaymentProvider implements PaymentProviderInterface {
  abstract createSession(params: CreateSessionParams, payment: PaymentRecord): Promise<SessionResult>
  abstract verifyWebhook(payload: string, signature: string): boolean
  abstract processWebhookEvent(event: WebhookEventData): Promise<WebhookProcessResult>

  protected handleError(error: any, context: string): never {
    console.error(`Payment provider error in ${context}:`, error)
    throw new Error(`Payment operation failed: ${error.message || 'Unknown error'}`)
  }

  protected validateAmount(amount: number): void {
    if (amount <= 0 || amount > 999999) {
      throw new Error(`Invalid payment amount: ${amount}`)
    }
  }

  protected validateCurrency(currency: string): void {
    const supportedCurrencies = ['USD', 'EUR', 'GBP', 'CNY']
    if (!supportedCurrencies.includes(currency)) {
      throw new Error(`Unsupported currency: ${currency}`)
    }
  }
}

// Creem 支付平台适配器
export class CreemProvider extends PaymentProvider {
  private readonly apiUrl: string
  private readonly secretKey: string
  private readonly webhookSecret: string

  constructor() {
    super()
    this.apiUrl = process.env.CREEM_API_URL || 'https://api.creem.io'
    this.secretKey = process.env.CREEM_SECRET_KEY || ''
    this.webhookSecret = process.env.CREEM_WEBHOOK_SECRET || ''

    if (!this.secretKey || !this.webhookSecret) {
      console.warn('Creem credentials not configured. Using mock mode.')
    }
  }

  async createSession(params: CreateSessionParams, payment: PaymentRecord): Promise<SessionResult> {
    try {
      this.validateAmount(payment.amount)
      this.validateCurrency(payment.currency)

      // 如果没有配置真实的 API key，返回模拟数据
      if (!this.secretKey || this.secretKey.startsWith('sk_test_mock')) {
        return this.createMockSession(params, payment)
      }

      const sessionParams: CreemSessionParams = {
        product_id: params.product_id,
        amount: Math.round(payment.amount * 100), // 转换为分
        currency: payment.currency,
        customer: {
          email: params.customer_email!,
          name: params.customer_name
        },
        success_url: `${params.success_url}?payment_id=${payment.id}&provider=creem`,
        cancel_url: `${params.cancel_url}?payment_id=${payment.id}&provider=creem`,
        metadata: {
          payment_id: payment.id,
          user_id: payment.user_id,
          product_id: params.product_id,
          generate_license: 'true'
        }
      }

      const response = await fetch(`${this.apiUrl}/v1/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionParams)
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Creem API error (${response.status}): ${errorData}`)
      }

      const sessionData: CreemSessionResponse = await response.json()

      return {
        session_url: sessionData.url,
        session_id: sessionData.id,
        payment_id: payment.id
      }

    } catch (error) {
      this.handleError(error, 'createSession')
    }
  }

  verifyWebhook(payload: string, signature: string): boolean {
    if (!this.webhookSecret) {
      console.warn('Creem webhook secret not configured, skipping verification')
      return true // 在测试模式下跳过验证
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('hex')

      return crypto.timingSafeEqual(
        Buffer.from(signature.replace('sha256=', '')),
        Buffer.from(expectedSignature)
      )
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return false
    }
  }

  async processWebhookEvent(event: WebhookEventData): Promise<WebhookProcessResult> {
    try {
      const creemEvent = event as CreemWebhookEvent

      switch (creemEvent.type) {
        case 'payment.completed':
          return await this.handlePaymentCompleted(creemEvent)
        
        case 'payment.failed':
          return await this.handlePaymentFailed(creemEvent)
        
        case 'payment.refunded':
          return await this.handlePaymentRefunded(creemEvent)
        
        default:
          console.log(`Unhandled Creem webhook event: ${creemEvent.type}`)
          return {
            success: true,
            message: `Event ${creemEvent.type} acknowledged but not processed`
          }
      }
    } catch (error) {
      console.error('Error processing Creem webhook:', error)
      return {
        success: false,
        message: `Failed to process webhook: ${error.message}`,
        shouldRetry: true
      }
    }
  }

  private async handlePaymentCompleted(event: CreemWebhookEvent): Promise<WebhookProcessResult> {
    const { session_id, payment_id, metadata } = event.data

    return {
      success: true,
      message: 'Payment completed successfully',
      paymentId: metadata.payment_id || session_id
    }
  }

  private async handlePaymentFailed(event: CreemWebhookEvent): Promise<WebhookProcessResult> {
    const { session_id, reason } = event.data

    return {
      success: true,
      message: `Payment failed: ${reason || 'Unknown reason'}`,
      paymentId: session_id
    }
  }

  private async handlePaymentRefunded(event: CreemWebhookEvent): Promise<WebhookProcessResult> {
    const { session_id } = event.data

    return {
      success: true,
      message: 'Payment refunded',
      paymentId: session_id
    }
  }

  private createMockSession(params: CreateSessionParams, payment: PaymentRecord): SessionResult {
    const mockSessionId = `creem_mock_${Date.now()}`
    const mockUrl = `https://checkout-mock.creem.io/session/${mockSessionId}?payment_id=${payment.id}`

    console.log(`[MOCK] Creem session created: ${mockSessionId}`)

    return {
      session_url: mockUrl,
      session_id: mockSessionId,
      payment_id: payment.id
    }
  }
}

// Paddle 支付平台适配器
export class PaddleProvider extends PaymentProvider {
  private readonly apiUrl: string
  private readonly apiKey: string
  private readonly webhookSecret: string

  constructor() {
    super()
    this.apiUrl = process.env.PADDLE_API_URL || 'https://api.paddle.com'
    this.apiKey = process.env.PADDLE_API_KEY || ''
    this.webhookSecret = process.env.PADDLE_WEBHOOK_SECRET || ''

    if (!this.apiKey || !this.webhookSecret) {
      console.warn('Paddle credentials not configured. Using mock mode.')
    }
  }

  async createSession(params: CreateSessionParams, payment: PaymentRecord): Promise<SessionResult> {
    try {
      this.validateAmount(payment.amount)
      this.validateCurrency(payment.currency)

      // 如果没有配置真实的 API key，返回模拟数据
      if (!this.apiKey || this.apiKey.startsWith('pk_test_mock')) {
        return this.createMockSession(params, payment)
      }

      const sessionParams: PaddleSessionParams = {
        items: [{
          price_id: this.getPaddlePriceId(params.product_id, payment.currency),
          quantity: 1
        }],
        customer_email: params.customer_email!,
        success_url: `${params.success_url}?payment_id=${payment.id}&provider=paddle`,
        cancel_url: `${params.cancel_url}?payment_id=${payment.id}&provider=paddle`,
        custom_data: {
          payment_id: payment.id,
          user_id: payment.user_id,
          product_id: params.product_id
        }
      }

      const response = await fetch(`${this.apiUrl}/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionParams)
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Paddle API error (${response.status}): ${errorData}`)
      }

      const sessionData: PaddleSessionResponse = await response.json()

      return {
        session_url: sessionData.data.url,
        session_id: sessionData.data.id,
        payment_id: payment.id
      }

    } catch (error) {
      this.handleError(error, 'createSession')
    }
  }

  verifyWebhook(payload: string, signature: string): boolean {
    if (!this.webhookSecret) {
      console.warn('Paddle webhook secret not configured, skipping verification')
      return true // 在测试模式下跳过验证
    }

    try {
      // Paddle 使用不同的签名验证方式
      // 这里简化处理，实际应用中需要根据 Paddle 文档实现
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('hex')

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    } catch (error) {
      console.error('Paddle webhook signature verification failed:', error)
      return false
    }
  }

  async processWebhookEvent(event: WebhookEventData): Promise<WebhookProcessResult> {
    try {
      const paddleEvent = event as PaddleWebhookEvent

      switch (paddleEvent.event_type) {
        case 'transaction.completed':
          return await this.handleTransactionCompleted(paddleEvent)
        
        case 'transaction.updated':
          return await this.handleTransactionUpdated(paddleEvent)
        
        case 'transaction.cancelled':
          return await this.handleTransactionCancelled(paddleEvent)
        
        default:
          console.log(`Unhandled Paddle webhook event: ${paddleEvent.event_type}`)
          return {
            success: true,
            message: `Event ${paddleEvent.event_type} acknowledged but not processed`
          }
      }
    } catch (error) {
      console.error('Error processing Paddle webhook:', error)
      return {
        success: false,
        message: `Failed to process webhook: ${error.message}`,
        shouldRetry: true
      }
    }
  }

  private async handleTransactionCompleted(event: PaddleWebhookEvent): Promise<WebhookProcessResult> {
    const { id, custom_data } = event.data

    return {
      success: true,
      message: 'Transaction completed successfully',
      paymentId: custom_data.payment_id || id
    }
  }

  private async handleTransactionUpdated(event: PaddleWebhookEvent): Promise<WebhookProcessResult> {
    const { id, status, custom_data } = event.data

    return {
      success: true,
      message: `Transaction updated: ${status}`,
      paymentId: custom_data.payment_id || id
    }
  }

  private async handleTransactionCancelled(event: PaddleWebhookEvent): Promise<WebhookProcessResult> {
    const { id, custom_data } = event.data

    return {
      success: true,
      message: 'Transaction cancelled',
      paymentId: custom_data.payment_id || id
    }
  }

  private getPaddlePriceId(productId: string, currency: string): string {
    // 在实际应用中，这里应该根据产品和货币返回对应的 Paddle Price ID
    // 这里使用模拟数据
    const priceMap: Record<string, Record<string, string>> = {
      'topwindow-license': {
        'USD': 'pri_01ha1vkf8x9x9x9x9x9x9x9x9x',
        'EUR': 'pri_01ha1vkf8x9x9x9x9x9x9x9x9y',
        'GBP': 'pri_01ha1vkf8x9x9x9x9x9x9x9x9z'
      }
    }

    return priceMap[productId]?.[currency] || 'pri_01ha1vkf8x9x9x9x9x9x9x9x9x'
  }

  private createMockSession(params: CreateSessionParams, payment: PaymentRecord): SessionResult {
    const mockSessionId = `paddle_mock_${Date.now()}`
    const mockUrl = `https://checkout-mock.paddle.com/session/${mockSessionId}?payment_id=${payment.id}`

    console.log(`[MOCK] Paddle session created: ${mockSessionId}`)

    return {
      session_url: mockUrl,
      session_id: mockSessionId,
      payment_id: payment.id
    }
  }
}

// 支付平台工厂
export class PaymentProviderFactory {
  private static providers: Map<string, PaymentProvider> = new Map()

  static getProvider(providerName: 'creem' | 'paddle'): PaymentProvider {
    if (!this.providers.has(providerName)) {
      switch (providerName) {
        case 'creem':
          this.providers.set(providerName, new CreemProvider())
          break
        case 'paddle':
          this.providers.set(providerName, new PaddleProvider())
          break
        default:
          throw new Error(`Unsupported payment provider: ${providerName}`)
      }
    }

    return this.providers.get(providerName)!
  }

  static getSupportedProviders(): string[] {
    return ['creem', 'paddle']
  }

  static isProviderSupported(provider: string): boolean {
    return this.getSupportedProviders().includes(provider)
  }
}

// 支付平台配置验证
export function validateProviderConfig(provider: 'creem' | 'paddle'): {
  isValid: boolean
  missingKeys: string[]
} {
  const requiredKeys: Record<string, string[]> = {
    creem: ['CREEM_SECRET_KEY', 'CREEM_WEBHOOK_SECRET'],
    paddle: ['PADDLE_API_KEY', 'PADDLE_WEBHOOK_SECRET']
  }

  const keys = requiredKeys[provider] || []
  const missingKeys = keys.filter(key => !process.env[key])

  return {
    isValid: missingKeys.length === 0,
    missingKeys
  }
}

// 支付平台健康检查
export async function checkProviderHealth(provider: 'creem' | 'paddle'): Promise<{
  isHealthy: boolean
  message: string
  responseTime?: number
}> {
  const startTime = Date.now()
  
  try {
    const providerInstance = PaymentProviderFactory.getProvider(provider)
    
    // 创建一个测试会话请求来检查 API 连通性
    const testParams: CreateSessionParams = {
      provider,
      product_id: 'test-health-check',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      customer_email: 'test@example.com'
    }

    const testPayment: PaymentRecord = {
      id: 'test-payment-health-check',
      user_id: 'test-user',
      payment_provider: provider,
      provider_payment_id: null,
      provider_session_id: null,
      amount: 1.00,
      currency: 'USD',
      status: 'pending',
      product_info: {
        product_id: 'test-health-check',
        name: 'Health Check',
        price: 1.00,
        currency: 'USD'
      },
      customer_info: {
        email: 'test@example.com',
        user_id: 'test-user'
      },
      metadata: {},
      created_at: new Date().toISOString(),
      completed_at: null,
      webhook_received_at: null
    }

    // 注意：在健康检查中，我们不实际创建会话，只检查配置
    const config = validateProviderConfig(provider)
    
    if (!config.isValid) {
      return {
        isHealthy: false,
        message: `Missing configuration: ${config.missingKeys.join(', ')}`,
        responseTime: Date.now() - startTime
      }
    }

    return {
      isHealthy: true,
      message: 'Provider is healthy',
      responseTime: Date.now() - startTime
    }

  } catch (error) {
    return {
      isHealthy: false,
      message: `Health check failed: ${error.message}`,
      responseTime: Date.now() - startTime
    }
  }
}

// 便捷函数
export const { getProvider, getSupportedProviders, isProviderSupported } = PaymentProviderFactory

// TESTING-GUIDE: 需覆盖用例
// 1. 支付平台适配器测试 - Creem/Paddle API 调用和响应处理
// 2. Webhook 验证测试 - 签名验证的正确性和安全性
// 3. 错误处理测试 - 网络错误、API 错误、配置错误
// 4. 模拟模式测试 - 在没有真实 API 密钥时的模拟行为