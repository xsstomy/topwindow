// 支付系统类型定义
export type PaymentProvider = 'creem' | 'paddle'

export type PaymentStatus = 
  | 'pending'    // 待支付
  | 'completed'  // 支付完成  
  | 'failed'     // 支付失败
  | 'refunded'   // 已退款
  | 'cancelled'  // 已取消

// 支付会话创建参数
export interface CreateSessionParams {
  provider: PaymentProvider
  product_id: string
  success_url: string
  cancel_url: string
  customer_email?: string
  customer_name?: string
}

// 支付会话返回结果
export interface SessionResult {
  session_url: string
  session_id: string
  payment_id: string  // 内部支付记录ID
}

// 产品信息
export interface ProductInfo {
  product_id: string
  name: string
  price: number
  currency: string
  features?: string[]
}

// 客户信息
export interface CustomerInfo {
  email: string
  name?: string
  user_id: string
}

// 支付记录 (对应数据库 payments 表)
export interface PaymentRecord {
  id: string
  user_id: string
  payment_provider: PaymentProvider
  provider_payment_id: string | null
  provider_session_id: string | null
  amount: number
  currency: string
  status: PaymentStatus
  product_info: ProductInfo
  customer_info: CustomerInfo | null
  metadata: Record<string, any>
  created_at: string
  completed_at: string | null
  webhook_received_at: string | null
}

// Webhook 事件数据
export interface WebhookEventData {
  type: string
  data: {
    session_id: string
    payment_id?: string
    amount: number
    currency: string
    status: string
    customer_email?: string
    metadata?: Record<string, any>
  }
}

// 支付平台适配器接口
export interface PaymentProviderInterface {
  createSession(params: CreateSessionParams, payment: PaymentRecord): Promise<SessionResult>
  verifyWebhook(payload: string, signature: string): boolean
  processWebhookEvent(event: WebhookEventData): Promise<WebhookProcessResult>
}

// Webhook处理结果
export interface WebhookProcessResult {
  success: boolean
  message: string
  shouldRetry?: boolean
  paymentId?: string
  licenseKey?: string
}

// Creem 特定类型
export interface CreemSessionParams {
  product_id: string
  amount: number  // 以分为单位
  currency: string
  customer: {
    email: string
    name?: string
  }
  success_url: string
  cancel_url: string
  metadata: Record<string, any>
}

export interface CreemSessionResponse {
  id: string
  url: string
  status: string
  metadata: Record<string, any>
}

export interface CreemWebhookEvent {
  type: 'payment.completed' | 'payment.failed' | 'payment.refunded'
  data: {
    session_id: string
    payment_id: string
    amount: number
    currency: string
    customer: {
      email: string
      name?: string
    }
    metadata: Record<string, any>
    status: string
    reason?: string  // 失败原因
  }
}

// Paddle 特定类型
export interface PaddleSessionParams {
  items: Array<{
    price_id: string
    quantity: number
  }>
  customer_email: string
  success_url: string
  cancel_url: string
  custom_data: Record<string, any>
}

export interface PaddleSessionResponse {
  data: {
    id: string
    url: string
    status: string
    custom_data: Record<string, any>
  }
}

export interface PaddleWebhookEvent {
  event_type: 'transaction.completed' | 'transaction.updated' | 'transaction.cancelled'
  data: {
    id: string
    status: string
    amount: string
    currency_code: string
    customer: {
      email: string
      name?: string
    }
    custom_data: Record<string, any>
    items: Array<{
      price_id: string
      quantity: number
    }>
  }
}

// 邮件发送相关类型
export interface LicenseEmailParams {
  userEmail: string
  userName: string
  licenseKey: string
  productName: string
  activationLimit: number
  downloadUrl?: string
}

export interface PaymentConfirmationEmailParams {
  userEmail: string
  userName: string
  amount: number
  currency: string
  productName: string
  paymentId: string
  invoiceUrl?: string
}

export interface PaymentFailureEmailParams {
  userEmail: string
  userName: string
  reason: string
  supportUrl?: string
  retryUrl?: string
}

// 邮件发送结果
export interface EmailSendResult {
  success: boolean
  messageId?: string
  error?: string
}

// 支付错误类型
export enum PaymentErrorType {
  NETWORK_ERROR = 'network_error',
  VALIDATION_ERROR = 'validation_error', 
  PROVIDER_ERROR = 'provider_error',
  WEBHOOK_ERROR = 'webhook_error',
  LICENSE_GENERATION_ERROR = 'license_generation_error',
  EMAIL_SEND_ERROR = 'email_send_error'
}

// 支付错误详情
export interface PaymentError {
  type: PaymentErrorType
  message: string
  code?: string
  details?: Record<string, any>
  retryable?: boolean
}

// 重试配置
export interface RetryConfig {
  maxAttempts: number
  backoffMultiplier: number
  initialDelay: number
}

// 支付统计数据
export interface PaymentMetrics {
  totalSessions: number
  completedPayments: number
  failedPayments: number
  conversionRate: number
  averageAmount: number
  revenueTotal: number
}

// 支付过滤器 (用于查询)
export interface PaymentFilter {
  provider?: PaymentProvider
  status?: PaymentStatus
  startDate?: string
  endDate?: string
  userId?: string
  minAmount?: number
  maxAmount?: number
}

// 分页参数
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 分页结果
export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// API 响应格式
export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  message: string
  data?: T
  error?: {
    code: string
    details?: Record<string, any>
  }
}

// 支付会话创建API响应
export type CreateSessionResponse = ApiResponse<{
  payment_id: string
  session_url: string
  session_id: string
  expires_at: string
}>

// 支付状态查询API响应
export type PaymentStatusResponse = ApiResponse<{
  payment: PaymentRecord
  license?: {
    license_key: string
    status: string
    expires_at: string | null
  }
}>

// 环境配置类型
export interface PaymentConfig {
  creem: {
    publicKey: string
    secretKey: string
    webhookSecret: string
    apiUrl: string
  }
  paddle: {
    publicKey: string
    apiKey: string
    webhookSecret: string
    apiUrl: string
  }
  email: {
    apiKey: string
    fromEmail: string
    supportEmail: string
  }
  app: {
    baseUrl: string
    successUrl: string
    cancelUrl: string
    errorUrl: string
  }
}

// 验证函数类型
export type PaymentValidator<T> = (data: T) => {
  isValid: boolean
  errors: string[]
}

// 常量定义
export const PAYMENT_CONSTANTS = {
  DEFAULT_CURRENCY: 'USD',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30分钟
  WEBHOOK_TIMEOUT: 10 * 1000, // 10秒
  EMAIL_TIMEOUT: 30 * 1000, // 30秒
  RETRY_DELAYS: [1000, 2000, 4000], // 重试延迟 (毫秒)
  MAX_WEBHOOK_RETRIES: 3,
  SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP', 'CNY'],
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 9999.99
} as const

// 支付流程状态机
export type PaymentFlowState = 
  | 'session_created'
  | 'payment_started'
  | 'payment_processing'
  | 'payment_completed'
  | 'license_generated'
  | 'email_sent'
  | 'flow_completed'
  | 'payment_failed'
  | 'flow_cancelled'

// 支付流程事件
export type PaymentFlowEvent = 
  | 'CREATE_SESSION'
  | 'START_PAYMENT'
  | 'COMPLETE_PAYMENT'
  | 'GENERATE_LICENSE'
  | 'SEND_EMAIL'
  | 'FAIL_PAYMENT'
  | 'CANCEL_PAYMENT'
  | 'RETRY_OPERATION'

// 支付流程上下文
export interface PaymentFlowContext {
  paymentId: string
  userId: string
  productId: string
  amount: number
  currency: string
  provider: PaymentProvider
  currentState: PaymentFlowState
  metadata: Record<string, any>
  errors: PaymentError[]
  retryCount: number
  createdAt: string
  updatedAt: string
}

// TESTING-GUIDE: 需覆盖用例
// 1. 支付类型验证 - 所有接口的输入验证
// 2. 支付流程状态机 - 状态转换的完整性测试
// 3. 错误处理类型 - 不同错误类型的处理逻辑
// 4. 邮件模板数据 - 邮件内容的正确性验证