// License Key 相关类型定义

export interface LicenseKeyConfig {
  productPrefix: string
  keyLength: number
  checksumEnabled: boolean
}

export interface DeviceInfo {
  name: string
  type: string
  version?: string
  platform?: string
}

export interface License {
  license_key: string
  user_id: string
  payment_id?: string
  product_id: string
  status: 'active' | 'revoked' | 'expired'
  activation_limit: number
  activated_devices: string[]
  created_at: string
  expires_at?: string
  last_validated_at?: string
  metadata?: Record<string, any>
}

export interface UserDevice {
  id: string
  user_id: string
  license_key: string
  device_id: string
  device_name: string
  device_type: string
  device_info: DeviceInfo
  first_activated_at: string
  last_seen_at: string
  status: 'active' | 'inactive' | 'revoked'
}

export interface ActivationRequest {
  license_key: string
  device_id: string
  device_info: DeviceInfo
}

export interface ActivationResponse {
  status: 'success' | 'error'
  message: string
  expires_at?: string
  activation_info?: {
    activated_at: string
    device_name: string
    remaining_activations?: number
  }
}

export interface ValidationRequest {
  license_key: string
  device_id: string
}

export interface ValidationResponse {
  status: 'success' | 'error'
  message: string
  license_info?: {
    expires_at?: string
    status: string
    last_validated_at?: string
  }
  device_info?: {
    last_seen_at?: string
    device_name?: string
  }
}

export interface UserLicensesResponse {
  status: 'success' | 'error'
  message?: string
  licenses?: LicenseWithDevices[]
}

export interface LicenseWithDevices extends License {
  user_devices: UserDevice[]
}

export interface DeviceManagementRequest {
  license_key: string
  device_id: string
  new_name?: string
}

export interface DeviceListResponse {
  status: 'success' | 'error'
  message?: string
  devices?: UserDevice[]
}

export interface GenerateLicenseParams {
  userId: string
  paymentId?: string
  productId: string
}

export interface LicenseGenerationResult {
  license_key: string
  user_id: string
  product_id: string
  activation_limit: number
}