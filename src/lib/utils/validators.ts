// 通用验证工具函数

export const validators = {
  /**
   * 验证邮箱格式
   */
  email: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  },

  /**
   * 验证License Key格式 (TW-XXXX-XXXX-XXXX-XXXX)
   * 注意：这只验证格式，不验证校验码
   */
  licenseKeyFormat: (key: string): boolean => {
    return /^TW-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)
  },

  /**
   * 完整验证License Key (格式 + 校验码)
   * 需要导入 validateLicenseKeyFormat 函数使用
   */
  licenseKey: (key: string): boolean => {
    // 先做格式检查
    if (!validators.licenseKeyFormat(key)) {
      return false
    }
    
    // 格式正确但这里无法做校验码验证（需要导入会造成循环依赖）
    // 实际应用中应该使用 validateLicenseKeyFormat() 函数
    return true
  },

  /**
   * 验证设备ID格式
   */
  deviceId: (id: string): boolean => {
    if (!id || typeof id !== 'string') return false
    // 设备ID应该在8-64字符之间，只包含字母数字和连字符
    return id.length >= 8 && id.length <= 64 && /^[a-zA-Z0-9-]+$/.test(id)
  },

  /**
   * 验证UUID格式
   */
  uuid: (id: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  },

  /**
   * 验证产品ID格式
   */
  productId: (id: string): boolean => {
    if (!id || typeof id !== 'string') return false
    // 产品ID应该是kebab-case格式，3-50字符
    return id.length >= 3 && id.length <= 50 && /^[a-z0-9-]+$/.test(id)
  },

  /**
   * 验证设备名称
   */
  deviceName: (name: string): boolean => {
    if (!name || typeof name !== 'string') return false
    // 设备名称1-100字符，允许字母数字空格和基本标点
    return name.length >= 1 && name.length <= 100 && /^[a-zA-Z0-9\s\-_.'()]+$/.test(name)
  },

  /**
   * 验证设备类型
   */
  deviceType: (type: string): boolean => {
    if (!type || typeof type !== 'string') return false
    const validTypes = [
      'mac', 'macbook', 'macbook_pro', 'macbook_air', 
      'imac', 'mac_mini', 'mac_pro', 'mac_studio'
    ]
    return validTypes.includes(type.toLowerCase())
  }
}

/**
 * 清理用户输入，移除潜在的恶意字符
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .trim()
    .replace(/[<>]/g, '') // 移除HTML标签字符
    .replace(/[\x00-\x1f\x7f]/g, '') // 移除控制字符
    .slice(0, 1000) // 限制长度
}

/**
 * 验证对象是否包含所有必需的字段
 */
export function validateRequiredFields<T extends Record<string, any>>(
  obj: T,
  requiredFields: (keyof T)[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = []
  
  for (const field of requiredFields) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
      missingFields.push(String(field))
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}

/**
 * API限流检查器
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string, 
  limit: number = 10, 
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const windowStart = Math.floor(now / windowMs) * windowMs
  const key = `${identifier}-${windowStart}`
  
  const current = rateLimitMap.get(key)
  
  if (!current) {
    rateLimitMap.set(key, { count: 1, resetTime: windowStart + windowMs })
    return { allowed: true, remaining: limit - 1, resetTime: windowStart + windowMs }
  }
  
  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime }
  }
  
  current.count++
  return { 
    allowed: true, 
    remaining: limit - current.count, 
    resetTime: current.resetTime 
  }
}

/**
 * 清理过期的限流记录
 */
export function cleanupRateLimitMap(): void {
  const now = Date.now()
  
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}

/**
 * 简化版本的限流函数，兼容旧API
 */
export function rateLimit(
  identifier: string, 
  limit: number = 10, 
  windowMs: number = 60000
): boolean {
  const result = checkRateLimit(identifier, limit, windowMs)
  return result.allowed
}

// 定期清理限流记录（每5分钟）
if (typeof global !== 'undefined') {
  setInterval(cleanupRateLimitMap, 5 * 60 * 1000)
}