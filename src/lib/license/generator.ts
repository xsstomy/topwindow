// License Key 生成器
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import type { LicenseKeyConfig } from '@/types/license'

export class LicenseKeyGenerator {
  private config: LicenseKeyConfig

  constructor(config: Partial<LicenseKeyConfig> = {}) {
    this.config = {
      productPrefix: config.productPrefix || 'TW',
      keyLength: config.keyLength || 16,
      checksumEnabled: config.checksumEnabled ?? true
    }
  }

  /**
   * 生成许可证密钥
   * 格式: TW-XXXX-XXXX-XXXX-XXXX
   */
  generateLicenseKey(): string {
    // 生成基础密钥部分
    const rawKey = this.generateRawKey()
    
    // 添加校验码（如果启用）
    const keyWithChecksum = this.config.checksumEnabled 
      ? rawKey + this.generateChecksum(rawKey)
      : rawKey

    // 格式化为用户友好的分组格式
    const formattedKey = this.formatKey(keyWithChecksum)
    
    return `${this.config.productPrefix}-${formattedKey}`
  }

  /**
   * 批量生成许可证密钥
   */
  generateBatch(count: number): string[] {
    const keys: string[] = []
    const generatedSet = new Set<string>()

    while (keys.length < count) {
      const key = this.generateLicenseKey()
      
      // 确保唯一性
      if (!generatedSet.has(key)) {
        keys.push(key)
        generatedSet.add(key)
      }
    }

    return keys
  }

  /**
   * 验证许可证密钥格式
   */
  validateKeyFormat(licenseKey: string): boolean {
    if (!licenseKey || typeof licenseKey !== 'string') {
      return false
    }

    // 检查基本格式
    const pattern = new RegExp(
      `^${this.config.productPrefix}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$`
    )
    
    if (!pattern.test(licenseKey)) {
      return false
    }

    // 如果启用了校验码，验证校验码
    if (this.config.checksumEnabled) {
      return this.validateChecksum(licenseKey)
    }

    return true
  }

  /**
   * 生成原始密钥字符串
   */
  private generateRawKey(): string {
    // 使用UUID作为熵源，取指定长度
    const uuid = uuidv4().replace(/-/g, '').toUpperCase()
    
    // 如果UUID长度不足，补充随机字符
    if (uuid.length < this.config.keyLength) {
      const additional = this.generateRandomString(this.config.keyLength - uuid.length)
      return uuid + additional
    }
    
    return uuid.slice(0, this.config.keyLength)
  }

  /**
   * 生成随机字符串
   */
  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, chars.length)
      result += chars[randomIndex]
    }
    
    return result
  }

  /**
   * 生成校验码
   */
  private generateChecksum(key: string): string {
    const hash = crypto
      .createHash('sha256')
      .update(key + 'topwindow-salt-2024')
      .digest('hex')
    
    return hash.slice(0, 4).toUpperCase()
  }

  /**
   * 验证校验码
   */
  private validateChecksum(licenseKey: string): boolean {
    try {
      // 移除前缀和分隔符
      const keyPart = licenseKey
        .replace(`${this.config.productPrefix}-`, '')
        .replace(/-/g, '')

      if (keyPart.length < 4) return false

      // 提取主要部分和校验码
      const mainPart = keyPart.slice(0, -4)
      const providedChecksum = keyPart.slice(-4)

      // 计算期望的校验码
      const expectedChecksum = this.generateChecksum(mainPart)

      return providedChecksum === expectedChecksum
    } catch (error) {
      return false
    }
  }

  /**
   * 格式化密钥为分组格式 (XXXX-XXXX-XXXX-XXXX)
   */
  private formatKey(key: string): string {
    // 确保长度是20字符（16字符密钥 + 4字符校验码）
    const paddedKey = key.padEnd(20, '0')
    
    // 分割为4个4字符的组
    return paddedKey.match(/.{1,4}/g)?.join('-') || paddedKey
  }

  /**
   * 获取密钥信息（调试用）
   */
  getKeyInfo(licenseKey: string): {
    isValid: boolean
    format: string
    hasChecksum: boolean
    parts: string[]
  } {
    const isValid = this.validateKeyFormat(licenseKey)
    const parts = licenseKey.split('-')
    
    return {
      isValid,
      format: `${this.config.productPrefix}-XXXX-XXXX-XXXX-XXXX`,
      hasChecksum: this.config.checksumEnabled,
      parts
    }
  }
}

// 默认生成器实例
export const defaultLicenseGenerator = new LicenseKeyGenerator()

// 便捷函数
export function generateLicenseKey(): string {
  return defaultLicenseGenerator.generateLicenseKey()
}

export function validateLicenseKeyFormat(key: string): boolean {
  return defaultLicenseGenerator.validateKeyFormat(key)
}

export function generateLicenseKeyBatch(count: number): string[] {
  return defaultLicenseGenerator.generateBatch(count)
}

// TESTING-GUIDE: 需覆盖用例
// 1. 基础密钥生成测试 - 格式正确性
// 2. 校验码验证测试 - 有效/无效校验码
// 3. 批量生成测试 - 唯一性保证
// 4. 边界情况测试 - 无效输入处理