// 支付平台适配器实现
import crypto from 'crypto'
import { creemConfig, paddleConfig, validateProviderConfig } from './config'
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
  private readonly config: typeof creemConfig

  constructor() {
    super()
    this.config = creemConfig

    // Validate configuration on startup
    const validation = validateProviderConfig('creem')
    if (!validation.isValid) {
      console.warn(`Creem configuration incomplete (${this.config.mode} mode):`, validation.missingKeys.join(', '))
    }
    if (validation.warnings.length > 0) {
      console.warn('Creem configuration warnings:', validation.warnings.join(', '))
    }

    console.log(`Creem provider initialized in ${this.config.mode} mode`)
  }

  async createSession(params: CreateSessionParams, payment: PaymentRecord): Promise<SessionResult> {
    try {
      this.validateAmount(payment.amount)
      this.validateCurrency(payment.currency)

      // Check if using mock configuration
      const isMockMode = !this.config.secretKey || 
                        (this.config.secretKey && this.config.secretKey.includes('mock')) || 
                        this.config.secretKey === 'sk_test_your_real_secret_key_here'

      if (isMockMode) {
        console.log(`[CREEM ${this.config.mode.toUpperCase()}] Using mock mode - no real API key configured`)
        return this.createMockSession(params, payment)
      }

      // Use configured product ID or fall back to params
      const productId = this.config.productId || params.product_id

      const sessionParams: CreemSessionParams = {
        product_id: productId,
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
          product_id: productId,
          generate_license: 'true',
          mode: this.config.mode
        }
      }

      console.log(`[CREEM ${this.config.mode.toUpperCase()}] Creating session:`, {
        product_id: productId,
        amount: sessionParams.amount,
        currency: sessionParams.currency,
        api_url: this.config.apiUrl
      })

      const response = await fetch(`${this.config.apiUrl}/v1/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionParams)
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Creem API error (${response.status}): ${errorData}`)
      }

      const sessionData: CreemSessionResponse = await response.json()

      console.log(`[CREEM ${this.config.mode.toUpperCase()}] Session created:`, {
        session_id: sessionData.id,
        payment_id: payment.id
      })

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
    if (!this.config.webhookSecret || (this.config.webhookSecret && this.config.webhookSecret.includes('mock'))) {
      console.warn(`[CREEM ${this.config.mode.toUpperCase()}] Webhook secret not configured, skipping verification`)
      return true // 在测试模式下跳过验证
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(payload)
        .digest('hex')

      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature.replace('sha256=', '')),
        Buffer.from(expectedSignature)
      )

      console.log(`[CREEM ${this.config.mode.toUpperCase()}] Webhook signature verification:`, isValid ? 'VALID' : 'INVALID')
      return isValid

    } catch (error) {
      console.error(`[CREEM ${this.config.mode.toUpperCase()}] Webhook signature verification failed:`, error)
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
    const mockSessionId = `creem_${this.config.mode}_mock_${Date.now()}`
    const mockUrl = `https://checkout-mock.creem.io/session/${mockSessionId}?payment_id=${payment.id}&mode=${this.config.mode}`

    console.log(`[CREEM ${this.config.mode.toUpperCase()}] Mock session created: ${mockSessionId}`)

    return {
      session_url: mockUrl,
      session_id: mockSessionId,
      payment_id: payment.id
    }
  }
}

// Paddle 支付平台适配器
export class PaddleProvider extends PaymentProvider {
  private readonly config: typeof paddleConfig

  constructor() {
    super()
    this.config = paddleConfig

    // Validate configuration on startup
    const validation = validateProviderConfig('paddle')
    if (!validation.isValid) {
      console.warn(`Paddle configuration incomplete (${this.config.mode} mode):`, validation.missingKeys.join(', '))
    }
    if (validation.warnings.length > 0) {
      console.warn('Paddle configuration warnings:', validation.warnings.join(', '))
    }

    console.log(`Paddle provider initialized in ${this.config.mode} mode`)
  }

  async createSession(params: CreateSessionParams, payment: PaymentRecord): Promise<SessionResult> {
    try {
      this.validateAmount(payment.amount)
      this.validateCurrency(payment.currency)

      // Check if using mock configuration
      const isMockMode = !this.config.apiKey || 
                        (this.config.apiKey && this.config.apiKey.includes('mock')) || 
                        this.config.apiKey === 'sk_live_your_production_key_here'

      if (isMockMode) {
        console.log(`[PADDLE ${this.config.mode.toUpperCase()}] Using mock mode - no real API key configured`)
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

      const response = await fetch(`${this.config.apiUrl}/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
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
    if (!this.config.webhookSecret || (this.config.webhookSecret && this.config.webhookSecret.includes('mock'))) {
      console.warn(`[PADDLE ${this.config.mode.toUpperCase()}] Webhook secret not configured, skipping verification`)
      return true // 在测试模式下跳过验证
    }

    try {
      // Paddle 使用不同的签名验证方式
      // 这里简化处理，实际应用中需要根据 Paddle 文档实现
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(payload)
        .digest('hex')

      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )

      console.log(`[PADDLE ${this.config.mode.toUpperCase()}] Webhook signature verification:`, isValid ? 'VALID' : 'INVALID')
      return isValid

    } catch (error) {
      console.error(`[PADDLE ${this.config.mode.toUpperCase()}] Webhook signature verification failed:`, error)
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
    const mockSessionId = `paddle_${this.config.mode}_mock_${Date.now()}`
    const mockUrl = `https://checkout-mock.paddle.com/session/${mockSessionId}?payment_id=${payment.id}&mode=${this.config.mode}`

    console.log(`[PADDLE ${this.config.mode.toUpperCase()}] Mock session created: ${mockSessionId}`)

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


// 便捷函数
export const { getProvider, getSupportedProviders, isProviderSupported } = PaymentProviderFactory

// TESTING-GUIDE: 需覆盖用例
// 1. 支付平台适配器测试 - Creem/Paddle API 调用和响应处理
// 2. Webhook 验证测试 - 签名验证的正确性和安全性
// 3. 错误处理测试 - 网络错误、API 错误、配置错误
// 4. 模拟模式测试 - 在没有真实 API 密钥时的模拟行为