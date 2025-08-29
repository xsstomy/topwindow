// 支付界面相关类型定义
export interface PaymentSelectorProps {
  productId: string
  onPaymentStart?: () => void
  onPaymentSuccess?: () => void
  onPaymentCancel?: () => void
  className?: string
  showComparison?: boolean
}

export interface PaymentSelectorConfig {
  productId: string
  showComparison: boolean
  enableAnalytics: boolean
  theme: 'light' | 'dark' | 'auto'
}

export interface PaymentOption {
  provider: 'creem' | 'paddle'
  name: string
  description: string
  features: string[]
  recommended: boolean
  processingFee?: string
}

export interface PaymentStatusTrackerProps {
  paymentId: string
  onStatusChange?: (status: PaymentStatus) => void
  autoRefresh?: boolean
  refreshInterval?: number
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing', 
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface PricingDisplayProps {
  price: number
  currency: string
  originalPrice?: number
  discount?: number
  features: string[]
  className?: string
}

export interface FeatureListProps {
  features: string[]
  className?: string
  showCheckmarks?: boolean
}

export interface PaymentOptionCardProps {
  option: PaymentOption
  selected: boolean
  onSelect: (provider: 'creem' | 'paddle') => void
  className?: string
}

// 产品信息接口
export interface ProductInfo {
  id: string
  name: string
  description: string
  price: number
  currency: string
  features: string[]
  activationLimit: number
  isActive: boolean
}

// 支付会话配置
export interface PaymentSessionConfig {
  provider: 'creem' | 'paddle'
  product_id: string
  success_url: string
  cancel_url?: string  // 可选参数，因为Creem不支持
  customer_email?: string
}

// 支付会话结果
export interface PaymentSession {
  sessionId: string
  sessionUrl: string
  paymentId: string
  expiresAt?: string
}

// 支付进度步骤
export interface PaymentStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'current' | 'completed' | 'error'
}

// 错误上下文
export interface ErrorContext {
  provider?: string
  productId?: string
  userId?: string
  timestamp: string
  userAgent?: string
  location?: string
}

// 支付错误类型
export interface PaymentError extends Error {
  type: 'network_error' | 'validation_error' | 'provider_error' | 'webhook_error' | 'license_generation_error'
  code?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  recoverable: boolean
  context?: ErrorContext
}

// 分析事件
export interface PaymentAnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp: string
  userId?: string
  sessionId?: string
}

// A/B 测试变体
export interface PaymentVariant {
  id: string
  name: string
  config: PaymentSelectorConfig
  weight: number
}