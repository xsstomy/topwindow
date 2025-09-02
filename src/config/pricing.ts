/**
 * TopWindow 产品价格配置
 *
 * 这个文件是所有价格信息的唯一来源 (Single Source of Truth)
 * 修改价格时只需要在这里更新，所有组件会自动使用新价格
 */

// 支持的货币类型
export type Currency = 'USD' | 'EUR' | 'CNY' | 'JPY';

// 产品价格配置接口
export interface ProductPricing {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // 原价，用于显示折扣
  currency: Currency;
  activationLimit: number; // Total device activation limit per product (across all user licenses)
  features: string[];
  isActive: boolean;
  metadata?: {
    popular?: boolean;
    recommended?: boolean;
    discountPercentage?: number;
  };
}

// 价格配置常量
export const PRICING_CONFIG = {
  // 当前主要货币
  DEFAULT_CURRENCY: 'USD' as Currency,

  // 价格更新时间（用于缓存失效）
  LAST_UPDATED: '2024-08-22T00:00:00Z',

  // 免费试用配置
  FREE_TRIAL: {
    DURATION_DAYS: 7,
    INCLUDES_ALL_FEATURES: true,
    DOWNLOAD_URL:
      'https://downloads.topwindow.app/releases/latest/topwindow-setup.dmg',
  },

  // 支持的地区和对应货币
  SUPPORTED_REGIONS: {
    US: 'USD',
    EU: 'EUR',
    CN: 'CNY',
    JP: 'JPY',
  } as const,
} as const;

// 核心产品价格定义
export const PRODUCT_PRICES: Record<string, ProductPricing> = {
  'topwindow-license': {
    id: 'topwindow-license',
    name: 'TopWindow Professional License',
    description:
      'Professional macOS window management tool with lifetime license',
    price: 4.99,
    currency: 'USD',
    activationLimit: 1,
    features: [
      'Lifetime license',
      'Single device activation',
      'Free version updates',
      'Technical support',
      '7-day money-back guarantee',
      'Complete professional features',
      'Advanced hotkey settings',
      'Multi-monitor support (Coming Soon)',
    ],
    isActive: true,
    metadata: {
      recommended: true,
    },
  },

  // 未来可能的其他产品
  'topwindow-basic': {
    id: 'topwindow-basic',
    name: 'TopWindow Basic License',
    description: 'Basic macOS window management license for single device',
    price: 2.99,
    currency: 'USD',
    activationLimit: 1,
    features: [
      'Lifetime license',
      'Single device activation',
      'Basic technical support',
      '7-day money-back guarantee',
    ],
    isActive: false, // 暂时不启用
    metadata: {
      recommended: false,
    },
  },
} as const;

// 工具函数：获取产品价格信息
export function getProductPricing(productId: string): ProductPricing | null {
  return PRODUCT_PRICES[productId] || null;
}

// 工具函数：获取格式化的价格字符串
export function formatPrice(price: number, currency: Currency = 'USD'): string {
  const formatters = {
    USD: (price: number) => `$${price.toFixed(2)}`,
    EUR: (price: number) => `€${price.toFixed(2)}`,
    CNY: (price: number) => `¥${price.toFixed(2)}`,
    JPY: (price: number) => `¥${Math.round(price)}`,
  };

  return formatters[currency](price);
}

// 工具函数：获取价格信息（简化版，移除折扣逻辑）
export function getPriceInfo(productId: string): {
  currentPrice: number;
  currency: string;
} {
  const product = getProductPricing(productId);

  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }

  return {
    currentPrice: product.price,
    currency: product.currency,
  };
}

// 工具函数：获取所有活跃产品
export function getActiveProducts(): ProductPricing[] {
  return Object.values(PRODUCT_PRICES).filter(product => product.isActive);
}

// 工具函数：验证价格配置
export function validatePricingConfig(): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  Object.entries(PRODUCT_PRICES).forEach(([key, product]) => {
    if (key !== product.id) {
      errors.push(
        `Product key "${key}" does not match product.id "${product.id}"`
      );
    }

    if (product.price <= 0) {
      errors.push(
        `Product "${product.id}" has invalid price: ${product.price}`
      );
    }

    if (product.activationLimit < 1) {
      errors.push(
        `Product "${product.id}" has invalid activation limit: ${product.activationLimit}`
      );
    }

    if (!product.features || product.features.length === 0) {
      errors.push(`Product "${product.id}" has no features defined`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 工具函数：获取免费试用信息
export function getTrialInfo(): {
  durationDays: number;
  includesAllFeatures: boolean;
  downloadUrl: string;
  description: string;
} {
  return {
    durationDays: PRICING_CONFIG.FREE_TRIAL.DURATION_DAYS,
    includesAllFeatures: PRICING_CONFIG.FREE_TRIAL.INCLUDES_ALL_FEATURES,
    downloadUrl: PRICING_CONFIG.FREE_TRIAL.DOWNLOAD_URL,
    description: `${PRICING_CONFIG.FREE_TRIAL.DURATION_DAYS}-day free trial with full professional features`,
  };
}

// 导出主要产品价格常量（向后兼容）
export const TOPWINDOW_LICENSE_PRICE =
  PRODUCT_PRICES['topwindow-license'].price;
export const TOPWINDOW_LICENSE_CURRENCY =
  PRODUCT_PRICES['topwindow-license'].currency;

// 导出试用配置（向后兼容）
export const FREE_TRIAL_DAYS = PRICING_CONFIG.FREE_TRIAL.DURATION_DAYS;
export const FREE_TRIAL_DOWNLOAD_URL = PRICING_CONFIG.FREE_TRIAL.DOWNLOAD_URL;

// 类型导出 - ProductPricing 和 Currency 已经在上面通过 interface 和 type 导出了
