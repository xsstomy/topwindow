// License Key 格式验证器
import { validators } from '@/lib/utils/validators'
import { validateLicenseKeyComplete } from './validation-utils'
import type { ActivationRequest, ValidationRequest, DeviceInfo } from '@/types/license'

export class LicenseValidator {
  /**
   * 验证激活请求的完整性
   */
  static validateActivationRequest(request: any): {
    isValid: boolean
    errors: string[]
    cleanData?: ActivationRequest
  } {
    const errors: string[] = []

    // 检查必需字段
    if (!request.license_key) {
      errors.push('License key is required')
    } else {
      const validation = validateLicenseKeyComplete(request.license_key)
      if (!validation.isValid) {
        errors.push(`Invalid license key: ${validation.reason}`)
      }
    }

    if (!request.device_id) {
      errors.push('Device ID is required')
    } else if (!validators.deviceId(request.device_id)) {
      errors.push('Invalid device ID format')
    }

    if (!request.device_info) {
      errors.push('Device info is required')
    } else {
      const deviceInfoErrors = this.validateDeviceInfo(request.device_info)
      errors.push(...deviceInfoErrors)
    }

    if (errors.length > 0) {
      return { isValid: false, errors }
    }

    // 返回清理后的数据
    const cleanData: ActivationRequest = {
      license_key: request.license_key.trim().toUpperCase(),
      device_id: request.device_id.trim(),
      device_info: this.sanitizeDeviceInfo(request.device_info)
    }

    return { isValid: true, errors: [], cleanData }
  }

  /**
   * 验证验证请求的完整性
   */
  static validateValidationRequest(request: any): {
    isValid: boolean
    errors: string[]
    cleanData?: ValidationRequest
  } {
    const errors: string[] = []

    if (!request.license_key) {
      errors.push('License key is required')
    } else {
      const validation = validateLicenseKeyComplete(request.license_key)
      if (!validation.isValid) {
        errors.push(`Invalid license key: ${validation.reason}`)
      }
    }

    if (!request.device_id) {
      errors.push('Device ID is required')
    } else if (!validators.deviceId(request.device_id)) {
      errors.push('Invalid device ID format')
    }

    if (errors.length > 0) {
      return { isValid: false, errors }
    }

    const cleanData: ValidationRequest = {
      license_key: request.license_key.trim().toUpperCase(),
      device_id: request.device_id.trim()
    }

    return { isValid: true, errors: [], cleanData }
  }

  /**
   * 验证设备信息
   */
  private static validateDeviceInfo(deviceInfo: any): string[] {
    const errors: string[] = []

    if (!deviceInfo || typeof deviceInfo !== 'object') {
      errors.push('Device info must be an object')
      return errors
    }

    if (!deviceInfo.name) {
      errors.push('Device name is required')
    } else if (!validators.deviceName(deviceInfo.name)) {
      errors.push('Invalid device name format')
    }

    if (!deviceInfo.type) {
      errors.push('Device type is required')
    } else if (!validators.deviceType(deviceInfo.type)) {
      errors.push('Invalid device type')
    }

    // version 是可选的
    if (deviceInfo.version && typeof deviceInfo.version !== 'string') {
      errors.push('Device version must be a string')
    }

    // platform 是可选的  
    if (deviceInfo.platform && typeof deviceInfo.platform !== 'string') {
      errors.push('Device platform must be a string')
    }

    return errors
  }

  /**
   * 清理设备信息
   */
  private static sanitizeDeviceInfo(deviceInfo: any): DeviceInfo {
    return {
      name: deviceInfo.name.trim().slice(0, 100),
      type: deviceInfo.type.toLowerCase().trim(),
      version: deviceInfo.version?.trim().slice(0, 50),
      platform: deviceInfo.platform?.trim().slice(0, 50)
    }
  }

  /**
   * 验证许可证状态
   */
  static validateLicenseStatus(license: any): {
    isValid: boolean
    reason?: string
  } {
    if (!license) {
      return { isValid: false, reason: 'License not found' }
    }

    if (license.status !== 'active') {
      return { isValid: false, reason: `License is ${license.status}` }
    }

    // 检查过期时间
    if (license.expires_at) {
      const expiryDate = new Date(license.expires_at)
      const now = new Date()
      
      if (expiryDate < now) {
        return { isValid: false, reason: 'License has expired' }
      }
    }

    return { isValid: true }
  }

  /**
   * 验证设备激活限制
   */
  static validateActivationLimit(
    license: any, 
    currentDeviceId: string,
    activatedDevices: any[]
  ): {
    canActivate: boolean
    reason?: string
    remainingSlots?: number
  } {
    if (!license.activation_limit) {
      return { canActivate: true }
    }

    // 检查设备是否已经激活
    const isAlreadyActivated = activatedDevices.some(
      device => device.device_id === currentDeviceId && device.status === 'active'
    )

    if (isAlreadyActivated) {
      return { canActivate: true, reason: 'Device already activated' }
    }

    // 检查激活数量限制
    const activeDeviceCount = activatedDevices.filter(
      device => device.status === 'active'
    ).length

    if (activeDeviceCount >= license.activation_limit) {
      return { 
        canActivate: false, 
        reason: `Activation limit reached (${activeDeviceCount}/${license.activation_limit})`,
        remainingSlots: 0
      }
    }

    return { 
      canActivate: true,
      remainingSlots: license.activation_limit - activeDeviceCount
    }
  }

  /**
   * 验证设备管理请求
   */
  static validateDeviceManagementRequest(request: any, action: 'rename' | 'revoke'): {
    isValid: boolean
    errors: string[]
    cleanData?: any
  } {
    const errors: string[] = []

    if (!request.license_key) {
      errors.push('License key is required')
    } else {
      const validation = validateLicenseKeyComplete(request.license_key)
      if (!validation.isValid) {
        errors.push(`Invalid license key: ${validation.reason}`)
      }
    }

    if (!request.device_id) {
      errors.push('Device ID is required')
    } else if (!validators.deviceId(request.device_id)) {
      errors.push('Invalid device ID format')
    }

    if (action === 'rename') {
      if (!request.new_name) {
        errors.push('New device name is required')
      } else if (!validators.deviceName(request.new_name)) {
        errors.push('Invalid device name format')
      }
    }

    if (errors.length > 0) {
      return { isValid: false, errors }
    }

    const cleanData = {
      license_key: request.license_key.trim().toUpperCase(),
      device_id: request.device_id.trim(),
      ...(action === 'rename' && { new_name: request.new_name.trim() })
    }

    return { isValid: true, errors: [], cleanData }
  }

  /**
   * 验证分页参数
   */
  static validatePaginationParams(query: any): {
    page: number
    limit: number
    offset: number
  } {
    const page = Math.max(1, parseInt(query.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10))
    const offset = (page - 1) * limit

    return { page, limit, offset }
  }
}

// 便捷验证函数
export function validateActivationRequest(request: any) {
  return LicenseValidator.validateActivationRequest(request)
}

export function validateValidationRequest(request: any) {
  return LicenseValidator.validateValidationRequest(request)
}

export function validateLicenseStatus(license: any) {
  return LicenseValidator.validateLicenseStatus(license)
}

export function validateActivationLimit(license: any, deviceId: string, devices: any[]) {
  return LicenseValidator.validateActivationLimit(license, deviceId, devices)
}

// TESTING-GUIDE: 需覆盖用例
// 1. 激活请求验证 - 有效/无效的license_key, device_id, device_info
// 2. 许可证状态验证 - active/expired/revoked状态处理
// 3. 激活限制验证 - 超出限制/未超出限制/重复激活
// 4. 设备管理验证 - 重命名/撤销操作的输入验证