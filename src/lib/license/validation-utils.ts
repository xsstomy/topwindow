// License Key 验证工具函数
import { validateLicenseKeyFormat } from './generator'
import { validators } from '@/lib/utils/validators'

export interface LicenseKeyValidationResult {
  isValid: boolean
  reason: string
  details?: {
    formatValid: boolean
    checksumValid?: boolean
  }
}

/**
 * 完整的License Key验证（格式 + 校验码）
 */
export function validateLicenseKeyComplete(licenseKey: string): LicenseKeyValidationResult {
  if (!licenseKey || typeof licenseKey !== 'string') {
    return {
      isValid: false,
      reason: 'License Key不能为空',
      details: { formatValid: false }
    }
  }

  // 首先检查格式
  const formatValid = validators.licenseKeyFormat(licenseKey)
  if (!formatValid) {
    return {
      isValid: false,
      reason: '格式无效 - 应为 TW-XXXX-XXXX-XXXX-XXXX 格式',
      details: { formatValid: false }
    }
  }

  // 然后验证校验码
  const fullValidation = validateLicenseKeyFormat(licenseKey)
  if (!fullValidation) {
    return {
      isValid: false,
      reason: '校验码无效 - License Key可能被篡改或不是正确生成的',
      details: { 
        formatValid: true, 
        checksumValid: false 
      }
    }
  }

  return {
    isValid: true,
    reason: 'License Key有效',
    details: { 
      formatValid: true, 
      checksumValid: true 
    }
  }
}

/**
 * 仅验证格式（不验证校验码）
 */
export function validateLicenseKeyFormatOnly(licenseKey: string): LicenseKeyValidationResult {
  if (!licenseKey || typeof licenseKey !== 'string') {
    return {
      isValid: false,
      reason: 'License Key不能为空',
      details: { formatValid: false }
    }
  }

  const formatValid = validators.licenseKeyFormat(licenseKey)
  
  return {
    isValid: formatValid,
    reason: formatValid ? '格式有效' : '格式无效 - 应为 TW-XXXX-XXXX-XXXX-XXXX 格式',
    details: { formatValid }
  }
}

/**
 * 批量验证License Keys
 */
export function validateLicenseKeyBatch(licenseKeys: string[]): LicenseKeyValidationResult[] {
  return licenseKeys.map(key => validateLicenseKeyComplete(key))
}

/**
 * 生成测试用的有效License Key示例
 * 这些是实际生成的，包含正确的校验码
 */
export function getValidLicenseKeyExamples(): string[] {
  // 这些需要在运行时动态生成，因为校验码是计算出来的
  // 暂时返回空数组，将在测试页面中动态生成
  return []
}

/**
 * 获取无效License Key示例（用于测试）
 */
export function getInvalidLicenseKeyExamples(): Array<{key: string, reason: string}> {
  return [
    { key: 'INVALID-KEY', reason: '完全错误的格式' },
    { key: 'TW-123-456', reason: '分段长度不正确' },
    { key: 'TW-ABCD-EFGH-IJKL', reason: '长度不足' },
    { key: 'AB-1234-5678-9ABC-DEF0', reason: '错误的前缀' },
    { key: 'TW-A1B2-C3D4-E5F6-G7H8', reason: '格式正确但校验码错误（手动构造）' },
    { key: '', reason: '空字符串' },
    { key: 'TW-XXXX-XXXX-XXXX-XXXX', reason: '包含无效字符' }
  ]
}