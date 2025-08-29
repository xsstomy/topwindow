import { 
  PaymentSessionConfig, 
  PaymentSession, 
  PaymentStatus, 
  ProductInfo, 
  PaymentError,
  PaymentAnalyticsEvent,
  ErrorContext 
} from '@/types/payment-ui'

export class PaymentUIService {
  private static instance: PaymentUIService
  private analytics: PaymentAnalyticsEvent[] = []

  private constructor() {}

  static getInstance(): PaymentUIService {
    if (!PaymentUIService.instance) {
      PaymentUIService.instance = new PaymentUIService()
    }
    return PaymentUIService.instance
  }

  /**
   * 创建支付会话
   */
  async createPaymentSession(config: PaymentSessionConfig): Promise<PaymentSession> {
    try {
      this.trackEvent('payment_session_create_started', {
        provider: config.provider,
        productId: config.product_id
      })

      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        let errorMessage = 'Failed to create payment session'
        let errorData: any = {}
        
        try {
          errorData = await response.json()
          errorMessage = errorData.message || errorData.error?.message || errorMessage
        } catch (parseError) {
          // 如果无法解析错误响应，使用状态码信息
          errorMessage = `HTTP ${response.status}: ${response.statusText || 'Unknown error'}`
        }
        
        throw this.createPaymentError('provider_error', errorMessage, {
          provider: config.provider,
          productId: config.product_id,
          timestamp: new Date().toISOString()
        })
      }

      const sessionData = await response.json()
      
      this.trackEvent('payment_session_created', {
        provider: config.provider,
        productId: config.product_id,
        sessionId: sessionData.data.session_id
      })

      return {
        sessionId: sessionData.data.session_id,
        sessionUrl: sessionData.data.session_url,
        paymentId: sessionData.data.payment_id
      }
    } catch (error) {
      this.trackEvent('payment_session_create_failed', {
        provider: config.provider,
        productId: config.product_id,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }

  /**
   * 跟踪支付状态
   */
  async trackPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`/api/payments/status?payment_id=${paymentId}`)
      
      if (!response.ok) {
        throw this.createPaymentError('network_error', 'Failed to fetch payment status')
      }

      const statusData = await response.json()
      const status = statusData.status as PaymentStatus

      this.trackEvent('payment_status_checked', {
        paymentId,
        status
      })

      return status
    } catch (error) {
      this.trackEvent('payment_status_check_failed', {
        paymentId,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }

  /**
   * 获取产品信息
   */
  async getProductInfo(productId: string): Promise<ProductInfo> {
    try {
      // 使用缓存避免重复请求
      const cacheKey = `product_${productId}`
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        return cached
      }

      const response = await fetch(`/api/products/${productId}`)
      
      if (!response.ok) {
        throw this.createPaymentError('network_error', 'Failed to fetch product info')
      }

      const productData = await response.json()
      
      // 缓存 5 分钟
      this.setCache(cacheKey, productData, 5 * 60 * 1000)
      
      return productData
    } catch (error) {
      this.trackEvent('product_info_fetch_failed', {
        productId,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }

  /**
   * 获取支付选项
   */
  getPaymentOptions() {
    return [
      {
        provider: 'creem' as const,
        name: 'Creem Pay',
        description: '推荐 • 专为数字产品设计',
        features: ['快速处理', '低手续费', '自动发票', '退款保护'],
        recommended: true,
        processingFee: '2.9% + $0.30'
      },
      {
        provider: 'paddle' as const,
        name: 'Paddle',
        description: '全球支付 • 自动税务处理',
        features: ['全球支持', '税务合规', '多币种', '企业级'],
        recommended: false,
        processingFee: '5% + 税费'
      }
    ]
  }

  /**
   * 验证支付配置
   */
  validatePaymentConfig(config: PaymentSessionConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!config.product_id) {
      errors.push('产品ID不能为空')
    }

    if (!config.provider || !['creem', 'paddle'].includes(config.provider)) {
      errors.push('请选择有效的支付方式')
    }

    if (!config.success_url) {
      errors.push('成功回调URL不能为空')
    }

    // Only Paddle requires cancel_url, Creem doesn't need it
    if (config.provider === 'paddle' && !config.cancel_url) {
      errors.push('取消回调URL不能为空')
    }

    if (config.customer_email && !this.isValidEmail(config.customer_email)) {
      errors.push('邮箱格式不正确')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * 重定向到支付页面
   */
  redirectToPayment(sessionUrl: string): void {
    this.trackEvent('redirect_to_payment', { sessionUrl })
    window.location.href = sessionUrl
  }

  /**
   * 跟踪分析事件
   */
  private trackEvent(event: string, properties?: Record<string, any>): void {
    const analyticsEvent: PaymentAnalyticsEvent = {
      event,
      properties,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId()
    }

    this.analytics.push(analyticsEvent)

    // 发送到 Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        event_category: 'payment',
        ...properties
      })
    }

    // 发送到其他分析服务
    this.sendToAnalytics(analyticsEvent)
  }

  /**
   * 创建支付错误
   */
  private createPaymentError(
    type: PaymentError['type'], 
    message: string, 
    context?: Partial<ErrorContext>
  ): PaymentError {
    const error = new Error(message) as PaymentError
    error.type = type
    error.severity = this.getErrorSeverity(type)
    error.recoverable = this.isRecoverable(type)
    error.context = {
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      location: typeof window !== 'undefined' ? window.location.href : undefined,
      ...context
    }
    return error
  }

  private getErrorSeverity(type: PaymentError['type']): PaymentError['severity'] {
    switch (type) {
      case 'network_error':
        return 'medium'
      case 'validation_error':
        return 'low'
      case 'provider_error':
        return 'high'
      case 'webhook_error':
        return 'critical'
      case 'license_generation_error':
        return 'critical'
      default:
        return 'medium'
    }
  }

  private isRecoverable(type: PaymentError['type']): boolean {
    return ['network_error', 'provider_error'].includes(type)
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  private getCurrentUserId(): string | undefined {
    // 从认证上下文获取用户ID
    return typeof window !== 'undefined' ? 
      window.__USER_ID__ : undefined
  }

  private getSessionId(): string {
    // 生成或获取会话ID
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('payment_session_id')
      if (!sessionId) {
        sessionId = crypto.randomUUID()
        sessionStorage.setItem('payment_session_id', sessionId)
      }
      return sessionId
    }
    return crypto.randomUUID()
  }

  private sendToAnalytics(event: PaymentAnalyticsEvent): void {
    // 可以集成其他分析服务
    console.log('Analytics Event:', event)
  }

  // 简单的内存缓存实现
  private cache = new Map<string, { data: any; expires: number }>()

  private getFromCache(key: string): any {
    const cached = this.cache.get(key)
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    })
  }
}

export default PaymentUIService.getInstance()