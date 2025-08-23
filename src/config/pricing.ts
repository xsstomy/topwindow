/**
 * TopWindow 产品价格配置
 * 
 * 这个文件是所有价格信息的唯一来源 (Single Source of Truth)
 * 修改价格时只需要在这里更新，所有组件会自动使用新价格
 */

// 支持的货币类型
export type Currency = 'USD' | 'EUR' | 'CNY' | 'JPY'

// 产品价格配置接口
export interface ProductPricing {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number // 原价，用于显示折扣
  currency: Currency
  activationLimit: number // Total device activation limit per product (across all user licenses)
  features: string[]
  isActive: boolean
  metadata?: {
    popular?: boolean
    recommended?: boolean
    discountPercentage?: number
  }
}

// 价格配置常量
export const PRICING_CONFIG = {
  // 当前主要货币
  DEFAULT_CURRENCY: 'USD' as Currency,
  
  // 价格更新时间（用于缓存失效）
  LAST_UPDATED: '2024-08-22T00:00:00Z',
  
  // 免费试用配置
  FREE_TRIAL: {
    DURATION_DAYS: 30,
    INCLUDES_ALL_FEATURES: true,
    DOWNLOAD_URL: 'https://github.com/TopWindow/TopWindow/releases/latest'
  },
  
  // 支持的地区和对应货币
  SUPPORTED_REGIONS: {
    US: 'USD',
    EU: 'EUR', 
    CN: 'CNY',
    JP: 'JPY'
  } as const
} as const

// 核心产品价格定义
export const PRODUCT_PRICES: Record<string, ProductPricing> = {
  'topwindow-license': {
    id: 'topwindow-license',
    name: 'TopWindow Professional License',
    description: 'TopWindow 专业版一次性买断许可证 - 功能强大的 macOS 窗口管理工具',
    price: 4.99,
    originalPrice: 29.99, // 显示原价以突出优惠
    currency: 'USD',
    activationLimit: 3,
    features: [
      'Lifetime license',
      'Activate up to 3 devices total',
      'Free version updates',
      'Priority technical support', 
      '30-day money back guarantee',
      'Complete professional features',
      'Advanced hotkey settings',
      'Multi-monitor support'
    ],
    isActive: true,
    metadata: {
      popular: true,
      recommended: true,
      discountPercentage: 83 // (29.99 - 4.99) / 29.99 * 100
    }
  },
  
  // 未来可能的其他产品
  'topwindow-basic': {
    id: 'topwindow-basic',
    name: 'TopWindow Basic License',
    description: 'TopWindow 基础版许可证，支持单台设备使用',
    price: 2.99,
    currency: 'USD',
    activationLimit: 1,
    features: [
      'Lifetime license',
      'Activate 1 device total',
      'Basic technical support',
      '30-day money back guarantee'
    ],
    isActive: false, // 暂时不启用
    metadata: {
      popular: false,
      recommended: false
    }
  }
} as const

// 工具函数：获取产品价格信息
export function getProductPricing(productId: string): ProductPricing | null {
  return PRODUCT_PRICES[productId] || null
}

// 工具函数：获取格式化的价格字符串
export function formatPrice(price: number, currency: Currency = 'USD'): string {
  const formatters = {
    USD: (price: number) => `$${price.toFixed(2)}`,
    EUR: (price: number) => `€${price.toFixed(2)}`,
    CNY: (price: number) => `¥${price.toFixed(2)}`,
    JPY: (price: number) => `¥${Math.round(price)}`
  }
  
  return formatters[currency](price)
}

// 工具函数：获取折扣信息
export function getDiscountInfo(productId: string): {
  hasDiscount: boolean
  originalPrice?: number
  currentPrice: number
  discountPercentage?: number
  savings?: number
} {
  const product = getProductPricing(productId)
  
  if (!product) {
    throw new Error(`Product not found: ${productId}`)
  }
  
  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price)
  
  return {
    hasDiscount,
    originalPrice: product.originalPrice,
    currentPrice: product.price,
    discountPercentage: product.metadata?.discountPercentage,
    savings: hasDiscount ? (product.originalPrice! - product.price) : undefined
  }
}

// 工具函数：获取所有活跃产品
export function getActiveProducts(): ProductPricing[] {
  return Object.values(PRODUCT_PRICES).filter(product => product.isActive)
}

// 工具函数：验证价格配置
export function validatePricingConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  Object.entries(PRODUCT_PRICES).forEach(([key, product]) => {
    if (key !== product.id) {
      errors.push(`Product key "${key}" does not match product.id "${product.id}"`)
    }
    
    if (product.price <= 0) {
      errors.push(`Product "${product.id}" has invalid price: ${product.price}`)
    }
    
    if (product.activationLimit < 1) {
      errors.push(`Product "${product.id}" has invalid activation limit: ${product.activationLimit}`)
    }
    
    if (!product.features || product.features.length === 0) {
      errors.push(`Product "${product.id}" has no features defined`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// 工具函数：获取免费试用信息
export function getTrialInfo(): {
  durationDays: number
  includesAllFeatures: boolean
  downloadUrl: string
  description: string
} {
  return {
    durationDays: PRICING_CONFIG.FREE_TRIAL.DURATION_DAYS,
    includesAllFeatures: PRICING_CONFIG.FREE_TRIAL.INCLUDES_ALL_FEATURES,
    downloadUrl: PRICING_CONFIG.FREE_TRIAL.DOWNLOAD_URL,
    description: `免费体验${PRICING_CONFIG.FREE_TRIAL.DURATION_DAYS}天完整专业功能`
  }
}

// 导出主要产品价格常量（向后兼容）
export const TOPWINDOW_LICENSE_PRICE = PRODUCT_PRICES['topwindow-license'].price
export const TOPWINDOW_LICENSE_CURRENCY = PRODUCT_PRICES['topwindow-license'].currency

// 导出试用配置（向后兼容）
export const FREE_TRIAL_DAYS = PRICING_CONFIG.FREE_TRIAL.DURATION_DAYS
export const FREE_TRIAL_DOWNLOAD_URL = PRICING_CONFIG.FREE_TRIAL.DOWNLOAD_URL

// 类型导出
export type { ProductPricing, Currency }