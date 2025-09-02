// Payment business logic service
import { createClient } from '@supabase/supabase-js';
import { PaymentProviderFactory } from './providers';
import { LicenseService } from '@/lib/license/service';
import type {
  CreateSessionParams,
  SessionResult,
  PaymentRecord,
  PaymentStatus,
  WebhookEventData,
  WebhookProcessResult,
  PaymentFilter,
  PaginationParams,
  PaginatedResult,
  PaymentMetrics,
  PaymentError,
  PaymentFlowContext,
  PaymentFlowState,
  PaymentProvider,
} from '@/types/payment';
import type {
  PaymentInsertData,
  PaymentSessionUpdateData,
} from '@/types/database-insert-update';
import { PaymentErrorType } from '@/types/payment';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class PaymentService {
  /**
   * Create payment session
   */
  static async createPaymentSession(
    params: CreateSessionParams & { user_id?: string }
  ): Promise<SessionResult> {
    try {
      // Validate input parameters
      this.validateSessionParams(params);

      // Get product information
      const product = await this.getProductInfo(params.product_id);
      if (!product) {
        throw new Error(`Product not found: ${params.product_id}`);
      }

      // Create payment record
      const payment = await this.createPaymentRecord({
        ...params,
        customer_email: params.customer_email || '',
        amount: product.price,
        currency: product.currency,
        productInfo: product,
        user_id: params.user_id,
      });

      // Get payment provider instance
      const provider = PaymentProviderFactory.getProvider(params.provider);

      // Create payment session
      const sessionResult = await provider.createSession(params, payment);

      // Update payment record with session ID
      await this.updatePaymentSession(payment.id, {
        provider_session_id: sessionResult.session_id,
        metadata: {
          ...payment.metadata,
          session_url: sessionResult.session_url,
          created_at: new Date().toISOString(),
        },
      });

      console.log(
        `Payment session created: ${sessionResult.session_id} for payment ${payment.id}`
      );

      return {
        ...sessionResult,
        payment_id: payment.id,
      };
    } catch (error) {
      console.error('Create payment session error:', error);
      throw this.createPaymentError(
        PaymentErrorType.PROVIDER_ERROR,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Handle payment completed
   */
  static async handlePaymentCompleted(
    paymentId: string,
    webhookData: any
  ): Promise<{ success: boolean; licenseKey?: string; message: string }> {
    try {
      // Get payment record
      const payment = await this.getPaymentById(paymentId);
      if (!payment) {
        throw new Error(`Payment not found: ${paymentId}`);
      }

      if (payment.status === 'completed') {
        console.log(`Payment ${paymentId} already completed`);
        return {
          success: true,
          message: 'Payment already processed',
        };
      }

      // Update payment status
      await this.updatePaymentStatus(paymentId, 'completed', {
        provider_payment_id: webhookData.payment_id || webhookData.id,
        completed_at: new Date().toISOString(),
        webhook_received_at: new Date().toISOString(),
        metadata: {
          ...payment.metadata,
          webhook_data: webhookData,
        },
      });

      // Generate license
      const license = await LicenseService.generateLicense({
        userId: payment.user_id,
        paymentId: payment.id,
        productId: payment.product_info.product_id,
      });

      console.log(
        `Payment ${paymentId} completed successfully, license generated: ${license.license_key}`
      );

      return {
        success: true,
        licenseKey: license.license_key,
        message: 'Payment completed and license generated',
      };
    } catch (error) {
      console.error(`Handle payment completed error for ${paymentId}:`, error);

      // Mark payment as failed but keep webhook data for retry
      await this.updatePaymentStatus(paymentId, 'failed', {
        metadata: {
          processing_error:
            error instanceof Error ? error.message : 'Unknown error',
          webhook_data: webhookData,
          retry_scheduled: true,
        },
      });

      throw this.createPaymentError(
        PaymentErrorType.LICENSE_GENERATION_ERROR,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Handle payment failed
   */
  static async handlePaymentFailed(
    paymentId: string,
    reason: string
  ): Promise<void> {
    try {
      const payment = await this.getPaymentById(paymentId);
      if (!payment) {
        console.warn(`Payment not found for failure handling: ${paymentId}`);
        return;
      }

      await this.updatePaymentStatus(paymentId, 'failed', {
        webhook_received_at: new Date().toISOString(),
        metadata: {
          ...payment.metadata,
          failure_reason: reason,
          failed_at: new Date().toISOString(),
        },
      });

      console.log(`Payment ${paymentId} marked as failed: ${reason}`);
    } catch (error) {
      console.error(`Handle payment failed error for ${paymentId}:`, error);
      throw this.createPaymentError(
        PaymentErrorType.WEBHOOK_ERROR,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Handle Webhook event
   */
  static async processWebhookEvent(
    provider: PaymentProvider,
    event: WebhookEventData,
    paymentId?: string
  ): Promise<WebhookProcessResult> {
    try {
      const providerInstance = PaymentProviderFactory.getProvider(provider);
      const result = await providerInstance.processWebhookEvent(event);

      // If successful and payment complete event, trigger license generation
      if (result.success && result.paymentId) {
        const finalPaymentId = paymentId || result.paymentId;

        if (this.isPaymentCompletedEvent(event)) {
          const licenseResult = await this.handlePaymentCompleted(
            finalPaymentId,
            event.data
          );
          result.licenseKey = licenseResult.licenseKey;
        } else if (this.isPaymentFailedEvent(event)) {
          await this.handlePaymentFailed(
            finalPaymentId,
            event.data.status || 'Payment failed'
          );
        }
      }

      return result;
    } catch (error) {
      console.error('Process webhook event error:', error);
      return {
        success: false,
        message: `Webhook processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        shouldRetry: true,
      };
    }
  }

  /**
   * Query payment status
   */
  static async getPaymentStatus(paymentId: string): Promise<{
    payment: PaymentRecord | null;
    license?: any;
  }> {
    try {
      const payment = await this.getPaymentById(paymentId);
      if (!payment) {
        return { payment: null };
      }

      let license = null;
      if (payment.status === 'completed') {
        // Query associated license
        const { data: licenses } = await supabase
          .from('licenses')
          .select('license_key, status, expires_at')
          .eq('payment_id', paymentId)
          .single();

        license = licenses;
      }

      return { payment, license };
    } catch (error) {
      console.error('Get payment status error:', error);
      throw this.createPaymentError(
        PaymentErrorType.NETWORK_ERROR,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Get user payment history
   */
  static async getUserPayments(
    userId: string,
    filter: PaymentFilter = {},
    pagination: PaginationParams = { page: 1, limit: 20 }
  ): Promise<PaginatedResult<PaymentRecord>> {
    try {
      let query = supabase
        .from('payments')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // Apply filters
      if (filter.status) {
        query = query.eq('status', filter.status);
      }
      if (filter.provider) {
        query = query.eq('payment_provider', filter.provider);
      }
      if (filter.startDate) {
        query = query.gte('created_at', filter.startDate);
      }
      if (filter.endDate) {
        query = query.lte('created_at', filter.endDate);
      }
      if (filter.minAmount) {
        query = query.gte('amount', filter.minAmount);
      }
      if (filter.maxAmount) {
        query = query.lte('amount', filter.maxAmount);
      }

      // Apply pagination and sorting
      const offset = (pagination.page - 1) * pagination.limit;
      query = query
        .order(pagination.sortBy || 'created_at', {
          ascending: pagination.sortOrder === 'asc',
        })
        .range(offset, offset + pagination.limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const totalPages = Math.ceil((count || 0) / pagination.limit);

      return {
        data: data || [],
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: count || 0,
          totalPages,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
        },
      };
    } catch (error) {
      console.error('Get user payments error:', error);
      throw this.createPaymentError(
        PaymentErrorType.NETWORK_ERROR,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Get payment statistics
   */
  static async getPaymentMetrics(
    startDate?: string,
    endDate?: string
  ): Promise<PaymentMetrics> {
    try {
      let query = supabase
        .from('payments')
        .select('status, amount, currency, created_at');

      if (startDate) {
        query = query.gte('created_at', startDate);
      }
      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const payments = data || [];
      const completedPayments = payments.filter(p => p.status === 'completed');
      const failedPayments = payments.filter(p => p.status === 'failed');

      const totalSessions = payments.length;
      const completedCount = completedPayments.length;
      const failedCount = failedPayments.length;

      const revenueTotal = completedPayments.reduce(
        (sum, p) => sum + p.amount,
        0
      );
      const averageAmount =
        completedCount > 0 ? revenueTotal / completedCount : 0;
      const conversionRate =
        totalSessions > 0 ? (completedCount / totalSessions) * 100 : 0;

      return {
        totalSessions,
        completedPayments: completedCount,
        failedPayments: failedCount,
        conversionRate: Math.round(conversionRate * 100) / 100,
        averageAmount: Math.round(averageAmount * 100) / 100,
        revenueTotal: Math.round(revenueTotal * 100) / 100,
      };
    } catch (error) {
      console.error('Get payment metrics error:', error);
      throw this.createPaymentError(
        PaymentErrorType.NETWORK_ERROR,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Retry failed payment processing
   */
  static async retryFailedPayment(paymentId: string): Promise<{
    success: boolean;
    message: string;
    licenseKey?: string;
  }> {
    try {
      const payment = await this.getPaymentById(paymentId);
      if (!payment) {
        throw new Error(`Payment not found: ${paymentId}`);
      }

      if (payment.status !== 'failed') {
        return {
          success: false,
          message: 'Payment is not in failed status',
        };
      }

      // Check if there's webhook data to retry
      const webhookData = payment.metadata.webhook_data;
      if (!webhookData) {
        return {
          success: false,
          message: 'No webhook data available for retry',
        };
      }

      // Reprocess payment completion flow
      const result = await this.handlePaymentCompleted(paymentId, webhookData);

      return result;
    } catch (error) {
      console.error(`Retry failed payment error for ${paymentId}:`, error);
      return {
        success: false,
        message: `Retry failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Private helper methods

  private static validateSessionParams(params: CreateSessionParams): void {
    if (!params.provider) {
      throw new Error('Payment provider is required');
    }
    if (!params.product_id) {
      throw new Error('Product ID is required');
    }
    if (!params.success_url) {
      throw new Error('Success URL is required');
    }
    // Only Paddle requires cancel_url, Creem doesn't need it
    if (params.provider === 'paddle' && !params.cancel_url) {
      throw new Error('Cancel URL is required');
    }
    if (!params.customer_email) {
      throw new Error('Customer email is required');
    }
    if (!PaymentProviderFactory.isProviderSupported(params.provider)) {
      throw new Error(`Unsupported payment provider: ${params.provider}`);
    }
  }

  private static async getProductInfo(productId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (error) {
      throw new Error(`Failed to get product info: ${error.message}`);
    }

    return data;
  }

  private static async createPaymentRecord(params: {
    provider: PaymentProvider;
    product_id: string;
    customer_email: string;
    customer_name?: string;
    amount: number;
    currency: string;
    productInfo: any;
    user_id?: string;
  }): Promise<PaymentRecord> {
    const paymentData = {
      user_id: params.user_id || null,
      payment_provider: params.provider,
      amount: params.amount,
      currency: params.currency,
      status: 'pending' as PaymentStatus,
      product_info: {
        product_id: params.product_id,
        name: params.productInfo.name,
        price: params.amount,
        currency: params.currency,
        features: params.productInfo.features,
      },
      customer_info: {
        email: params.customer_email,
        name: params.customer_name,
        user_id: params.user_id || '',
      },
      metadata: {
        created_via: 'api',
        user_agent: '', // Will be filled in API layer
        ip_address: '', // Will be filled in API layer
      },
    };

    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData satisfies PaymentInsertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create payment record: ${error.message}`);
    }

    return data;
  }

  private static async updatePaymentSession(
    paymentId: string,
    updates: Partial<PaymentRecord>
  ): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .update(updates satisfies Partial<PaymentSessionUpdateData>)
      .eq('id', paymentId);

    if (error) {
      throw new Error(`Failed to update payment session: ${error.message}`);
    }
  }

  private static async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    additionalData: Partial<PaymentRecord> = {}
  ): Promise<void> {
    const updates = {
      status,
      ...additionalData,
    };

    const { error } = await supabase
      .from('payments')
      .update(updates satisfies Partial<PaymentSessionUpdateData>)
      .eq('id', paymentId);

    if (error) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  }

  private static async getPaymentById(
    paymentId: string
  ): Promise<PaymentRecord | null> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = not found
      throw new Error(`Failed to get payment: ${error.message}`);
    }

    return data;
  }

  private static isPaymentCompletedEvent(event: WebhookEventData): boolean {
    return (
      event.type === 'payment.completed' ||
      event.type === 'transaction.completed'
    );
  }

  private static isPaymentFailedEvent(event: WebhookEventData): boolean {
    return (
      event.type === 'payment.failed' || event.type === 'transaction.cancelled'
    );
  }

  private static createPaymentError(
    type: PaymentErrorType,
    message: string
  ): PaymentError {
    return {
      type,
      message,
      retryable:
        type === PaymentErrorType.NETWORK_ERROR ||
        type === PaymentErrorType.WEBHOOK_ERROR,
    };
  }
}

// Convenience function exports
export const {
  createPaymentSession,
  handlePaymentCompleted,
  handlePaymentFailed,
  processWebhookEvent,
  getPaymentStatus,
  getUserPayments,
  getPaymentMetrics,
  retryFailedPayment,
} = PaymentService;

// Payment flow manager
export class PaymentFlowManager {
  /**
   * Create payment flow context
   */
  static createFlowContext(
    paymentId: string,
    userId: string,
    productId: string,
    amount: number,
    currency: string,
    provider: PaymentProvider
  ): PaymentFlowContext {
    return {
      paymentId,
      userId,
      productId,
      amount,
      currency,
      provider,
      currentState: 'session_created',
      metadata: {},
      errors: [],
      retryCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Transition flow state
   */
  static transitionState(
    context: PaymentFlowContext,
    newState: PaymentFlowState,
    metadata?: Record<string, any>
  ): PaymentFlowContext {
    return {
      ...context,
      currentState: newState,
      metadata: { ...context.metadata, ...metadata },
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Log flow error
   */
  static recordError(
    context: PaymentFlowContext,
    error: PaymentError
  ): PaymentFlowContext {
    return {
      ...context,
      errors: [...context.errors, error],
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Increment retry count
   */
  static incrementRetry(context: PaymentFlowContext): PaymentFlowContext {
    return {
      ...context,
      retryCount: context.retryCount + 1,
      updatedAt: new Date().toISOString(),
    };
  }
}

// TESTING-GUIDE: Test cases to cover
// 1. Payment session creation - Success/Product not found/Parameter validation failure
// 2. Payment completion - Successful license generation/Duplicate processing/License generation failure
// 3. Webhook event handling - Proper handling of different event types
// 4. Payment status query - Correct responses for various statuses
// 5. Error handling and retry - Recovery mechanisms for various error scenarios
