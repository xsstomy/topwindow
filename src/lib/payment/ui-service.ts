import {
  PaymentSessionConfig,
  PaymentSession,
  PaymentStatus,
  ProductInfo,
  PaymentError,
  PaymentAnalyticsEvent,
  ErrorContext,
} from '@/types/payment-ui';

export class PaymentUIService {
  private static instance: PaymentUIService;
  private analytics: PaymentAnalyticsEvent[] = [];

  private constructor() {}

  static getInstance(): PaymentUIService {
    if (!PaymentUIService.instance) {
      PaymentUIService.instance = new PaymentUIService();
    }
    return PaymentUIService.instance;
  }

  /**
   * Create payment session
   */
  async createPaymentSession(
    config: PaymentSessionConfig
  ): Promise<PaymentSession> {
    try {
      this.trackEvent('payment_session_create_started', {
        provider: config.provider,
        productId: config.product_id,
      });

      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create payment session';
        let errorData: any = {};

        try {
          errorData = await response.json();
          errorMessage =
            errorData.message || errorData.error?.message || errorMessage;
        } catch (parseError) {
          // If unable to parse error response, use status code information
          errorMessage = `HTTP ${response.status}: ${response.statusText || 'Unknown error'}`;
        }

        throw this.createPaymentError('provider_error', errorMessage, {
          provider: config.provider,
          productId: config.product_id,
          timestamp: new Date().toISOString(),
        });
      }

      const sessionData = await response.json();

      this.trackEvent('payment_session_created', {
        provider: config.provider,
        productId: config.product_id,
        sessionId: sessionData.data.session_id,
      });

      return {
        sessionId: sessionData.data.session_id,
        sessionUrl: sessionData.data.session_url,
        paymentId: sessionData.data.payment_id,
      };
    } catch (error) {
      this.trackEvent('payment_session_create_failed', {
        provider: config.provider,
        productId: config.product_id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Track payment status
   */
  async trackPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(
        `/api/payments/status?payment_id=${paymentId}`
      );

      if (!response.ok) {
        throw this.createPaymentError(
          'network_error',
          'Failed to fetch payment status'
        );
      }

      const statusData = await response.json();
      const status = statusData.status as PaymentStatus;

      this.trackEvent('payment_status_checked', {
        paymentId,
        status,
      });

      return status;
    } catch (error) {
      this.trackEvent('payment_status_check_failed', {
        paymentId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get product information
   */
  async getProductInfo(productId: string): Promise<ProductInfo> {
    try {
      // Use cache to avoid duplicate requests
      const cacheKey = `product_${productId}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await fetch(`/api/products/${productId}`);

      if (!response.ok) {
        throw this.createPaymentError(
          'network_error',
          'Failed to fetch product info'
        );
      }

      const productData = await response.json();

      // Cache for 5 minutes
      this.setCache(cacheKey, productData, 5 * 60 * 1000);

      return productData;
    } catch (error) {
      this.trackEvent('product_info_fetch_failed', {
        productId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get payment options
   */
  getPaymentOptions() {
    return [
      {
        provider: 'creem' as const,
        name: 'Creem Pay',
        description: 'Digital Product Payment',
        features: ['Secure Payment'],
        recommended: true,
      },
    ];
  }

  /**
   * Validate payment configuration
   */
  validatePaymentConfig(config: PaymentSessionConfig): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!config.product_id) {
      errors.push('Product ID cannot be empty');
    }

    if (!config.provider || config.provider !== 'creem') {
      errors.push('Please select a valid payment method');
    }

    if (!config.success_url) {
      errors.push('Success callback URL cannot be empty');
    }

    // Creem doesn't require cancel_url

    if (config.customer_email && !this.isValidEmail(config.customer_email)) {
      errors.push('Invalid email format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Redirect to payment page
   */
  redirectToPayment(sessionUrl: string): void {
    this.trackEvent('redirect_to_payment', { sessionUrl });
    window.location.href = sessionUrl;
  }

  /**
   * Track analytics events
   */
  private trackEvent(event: string, properties?: Record<string, any>): void {
    const analyticsEvent: PaymentAnalyticsEvent = {
      event,
      properties,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
    };

    this.analytics.push(analyticsEvent);

    // Send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        event_category: 'payment',
        ...properties,
      });
    }

    // Send to other analytics services
    this.sendToAnalytics(analyticsEvent);
  }

  /**
   * Create payment error
   */
  private createPaymentError(
    type: PaymentError['type'],
    message: string,
    context?: Partial<ErrorContext>
  ): PaymentError {
    const error = new Error(message) as PaymentError;
    error.type = type;
    error.severity = this.getErrorSeverity(type);
    error.recoverable = this.isRecoverable(type);
    error.context = {
      timestamp: new Date().toISOString(),
      userAgent:
        typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      location:
        typeof window !== 'undefined' ? window.location.href : undefined,
      ...context,
    };
    return error;
  }

  private getErrorSeverity(
    type: PaymentError['type']
  ): PaymentError['severity'] {
    switch (type) {
      case 'network_error':
        return 'medium';
      case 'validation_error':
        return 'low';
      case 'provider_error':
        return 'high';
      case 'webhook_error':
        return 'critical';
      case 'license_generation_error':
        return 'critical';
      default:
        return 'medium';
    }
  }

  private isRecoverable(type: PaymentError['type']): boolean {
    return ['network_error', 'provider_error'].includes(type);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private getCurrentUserId(): string | undefined {
    // Get user ID from authentication context
    return typeof window !== 'undefined' ? window.__USER_ID__ : undefined;
  }

  private getSessionId(): string {
    // Generate or get session ID
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('payment_session_id');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem('payment_session_id', sessionId);
      }
      return sessionId;
    }
    return crypto.randomUUID();
  }

  private sendToAnalytics(event: PaymentAnalyticsEvent): void {
    // Can integrate other analytics services
    console.log('Analytics Event:', event);
  }

  // Simple in-memory cache implementation
  private cache = new Map<string, { data: any; expires: number }>();

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }
}

export default PaymentUIService.getInstance();
