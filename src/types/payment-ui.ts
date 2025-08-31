// Payment UI related type definitions
export interface PaymentSelectorProps {
  productId: string;
  onPaymentStart?: () => void;
  onPaymentSuccess?: () => void;
  onPaymentCancel?: () => void;
  className?: string;
  showComparison?: boolean;
}

export interface PaymentSelectorConfig {
  productId: string;
  showComparison: boolean;
  enableAnalytics: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface PaymentOption {
  provider: 'creem';
  name: string;
  description: string;
  features: string[];
  recommended: boolean;
  processingFee?: string;
}

export interface PaymentStatusTrackerProps {
  paymentId: string;
  onStatusChange?: (status: PaymentStatus) => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface PricingDisplayProps {
  price: number;
  currency: string;
  originalPrice?: number;
  discount?: number;
  features: string[];
  className?: string;
}

export interface FeatureListProps {
  features: string[];
  className?: string;
  showCheckmarks?: boolean;
}

export interface PaymentOptionCardProps {
  option: PaymentOption;
  selected: boolean;
  onSelect: (provider: 'creem') => void;
  className?: string;
}

// Product information interface
export interface ProductInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  activationLimit: number;
  isActive: boolean;
}

// Payment session configuration
export interface PaymentSessionConfig {
  provider: 'creem';
  product_id: string;
  success_url: string;
  cancel_url?: string; // Optional parameter, not used by Creem
  customer_email?: string;
}

// Payment session result
export interface PaymentSession {
  sessionId: string;
  sessionUrl: string;
  paymentId: string;
  expiresAt?: string;
}

// Payment progress steps
export interface PaymentStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed' | 'error';
}

// Error context
export interface ErrorContext {
  provider?: string;
  productId?: string;
  userId?: string;
  timestamp: string;
  userAgent?: string;
  location?: string;
}

// Payment error types
export interface PaymentError extends Error {
  type:
    | 'network_error'
    | 'validation_error'
    | 'provider_error'
    | 'webhook_error'
    | 'license_generation_error';
  code?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  context?: ErrorContext;
}

// Analytics events
export interface PaymentAnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

// A/B testing variants
export interface PaymentVariant {
  id: string;
  name: string;
  config: PaymentSelectorConfig;
  weight: number;
}
