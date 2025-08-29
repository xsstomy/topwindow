// 数据库插入和更新操作的数据对象接口定义
// 这些接口用于替代 `as any` 类型断言，提供类型安全的数据库操作

// =============================================================================
// Trial Analytics 相关接口
// =============================================================================

/** 试用分析数据插入接口 */
export interface TrialAnalyticsInsertData {
  trial_id: string;
  device_fingerprint_hash: string;
  trial_start_at: string;
  app_version: string;
  system_version: string;
  install_channel: string | null;
  device_type: string | null;
  trial_status: 'active';
  metadata: Record<string, any>;
}

/** 试用分析数据更新接口 - 完整更新 */
export interface TrialAnalyticsUpdateData {
  trial_end_at: string;
  trial_duration_seconds: number;
  trial_status: 'completed';
  updated_at: string;
}

/** 试用状态更新接口 - 仅状态更新 */
export interface TrialStatusUpdateData {
  trial_status: 'abandoned';
}

// =============================================================================
// Payment 相关接口
// =============================================================================

/** 支付记录插入接口 */
export interface PaymentInsertData {
  user_id: string | null;
  payment_provider: string;
  amount: number;
  currency: string;
  status: string;
  product_info: {
    product_id: string;
    name: string;
    price: number;
    currency: string;
    features: any;
  };
  customer_info: {
    email: string;
    name?: string;
    user_id: string;
  };
  metadata: {
    created_via: string;
    user_agent: string;
    ip_address: string;
  };
}

/** 支付会话更新接口 */
export interface PaymentSessionUpdateData {
  provider_payment_id?: string | null;
  provider_session_id?: string | null;
  status?: string;
  completed_at?: string | null;
  webhook_received_at?: string | null;
  metadata?: Record<string, any>;
}

/** 支付状态更新接口 */
export interface PaymentStatusUpdateData {
  status: string;
  completed_at?: string;
  webhook_received_at?: string;
  metadata?: Record<string, any>;
}

// =============================================================================
// License 相关接口
// =============================================================================

/** 许可证插入接口 */
export interface LicenseInsertData {
  license_key: string;
  user_id: string;
  payment_id?: string | null;
  product_id: string;
  status: 'active';
  activation_limit: number;
  activated_devices: any[];
  expires_at?: string | null;
  metadata: {
    generated_at: string;
    generated_by?: string;
    product_name?: string;
    product_info?: {
      name: string;
      price: number;
      currency: string;
    };
  };
}

/** 许可证验证时间更新接口 */
export interface LicenseValidationUpdateData {
  last_validated_at: string;
}

/** 许可证状态更新接口 */
export interface LicenseStatusUpdateData {
  status: 'expired';
}

// =============================================================================
// User Device 相关接口
// =============================================================================

/** 用户设备插入接口 */
export interface UserDeviceInsertData {
  user_id: string;
  license_key: string;
  device_id: string;
  device_name: string;
  device_type: string;
  device_info: any;
  first_activated_at?: string;
  last_seen_at?: string;
  status: 'active';
}

/** 用户设备更新接口 - 完整更新 */
export interface UserDeviceUpdateData {
  last_seen_at: string;
  device_info: any;
  device_name: string;
  status: 'active';
}

/** 设备名称更新接口 */
export interface DeviceNameUpdateData {
  device_name: string;
}

/** 设备状态更新接口 */
export interface DeviceStatusUpdateData {
  status: 'revoked';
}

/** 设备活跃时间更新接口 */
export interface DeviceLastSeenUpdateData {
  last_seen_at: string;
}

// =============================================================================
// Product 相关接口
// =============================================================================

/** 产品插入接口 */
export interface ProductInsertData {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  activation_limit: number;
  features: string[];
  is_active: boolean;
  metadata: {
    created_by: string;
    created_at: string;
  };
}

// =============================================================================
// User Profile 相关接口
// =============================================================================

/** 用户资料插入接口 */
export interface UserProfileInsertData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

// =============================================================================
// Webhook Payment Update 相关接口（用于支付 webhook 处理）
// =============================================================================

/** Webhook 支付完成更新接口 */
export interface WebhookPaymentCompletedUpdateData {
  provider_payment_id: string;
  status: 'completed';
  completed_at: string;
  webhook_received_at: string;
  metadata: Record<string, any>;
}

/** Webhook 支付失败更新接口 */
export interface WebhookPaymentFailedUpdateData {
  status: 'failed';
  webhook_received_at: string;
  metadata: Record<string, any>;
}

/** Webhook 支付退款更新接口 */
export interface WebhookPaymentRefundedUpdateData {
  status: 'refunded';
  webhook_received_at: string;
  metadata: Record<string, any>;
}