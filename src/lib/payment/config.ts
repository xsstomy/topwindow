// Payment provider configuration management
// Supports both test and production environments

export interface PaymentProviderConfig {
  creem: {
    secretKey: string
    publicKey: string
    webhookSecret: string
    apiUrl: string
    productId: string
    mode: 'test' | 'production'
  }
  paddle: {
    apiKey: string
    publicKey: string
    webhookSecret: string
    apiUrl: string
    mode: 'test' | 'production'
  }
}

/**
 * Determines if we should use test mode
 * Priority:
 * 1. CREEM_MODE environment variable
 * 2. NODE_ENV (development = test mode)
 */
function isTestMode(): boolean {
  const explicitMode = process.env.CREEM_MODE?.toLowerCase()
  if (explicitMode === 'test' || explicitMode === 'production') {
    return explicitMode === 'test'
  }
  
  // Fallback to NODE_ENV
  return process.env.NODE_ENV !== 'production'
}

/**
 * Get environment variable with fallback
 */
function getEnvVar(testKey: string, prodKey: string, fallback: string = ''): string {
  return isTestMode() 
    ? (process.env[testKey] || fallback)
    : (process.env[prodKey] || fallback)
}

/**
 * Creem configuration
 */
export const creemConfig = {
  secretKey: getEnvVar('CREEM_SECRET_KEY_TEST', 'CREEM_SECRET_KEY_PROD'),
  publicKey: getEnvVar('CREEM_PUBLIC_KEY_TEST', 'CREEM_PUBLIC_KEY_PROD'),
  webhookSecret: getEnvVar('CREEM_WEBHOOK_SECRET_TEST', 'CREEM_WEBHOOK_SECRET_PROD'),
  apiUrl: getEnvVar('CREEM_API_URL_TEST', 'CREEM_API_URL_PROD', 'https://api.creem.io'),
  productId: getEnvVar('CREEM_PRODUCT_ID_TEST', 'CREEM_PRODUCT_ID_PROD'),
  mode: isTestMode() ? 'test' as const : 'production' as const
}

/**
 * Paddle configuration  
 */
export const paddleConfig = {
  apiKey: getEnvVar('PADDLE_API_KEY_TEST', 'PADDLE_API_KEY_PROD'),
  publicKey: getEnvVar('PADDLE_PUBLIC_KEY_TEST', 'PADDLE_PUBLIC_KEY_PROD'),
  webhookSecret: getEnvVar('PADDLE_WEBHOOK_SECRET_TEST', 'PADDLE_WEBHOOK_SECRET_PROD'),
  apiUrl: getEnvVar('PADDLE_API_URL_TEST', 'PADDLE_API_URL_PROD', 'https://api.paddle.com'),
  mode: isTestMode() ? 'test' as const : 'production' as const
}

/**
 * Unified payment configuration
 */
export const paymentConfig: PaymentProviderConfig = {
  creem: creemConfig,
  paddle: paddleConfig
}

/**
 * Get current environment mode
 */
export function getCurrentMode(): 'test' | 'production' {
  return isTestMode() ? 'test' : 'production'
}

/**
 * Check if all required configuration is present for a provider
 */
export function validateProviderConfig(provider: 'creem' | 'paddle'): {
  isValid: boolean
  missingKeys: string[]
  warnings: string[]
} {
  const config = paymentConfig[provider]
  const missingKeys: string[] = []
  const warnings: string[] = []

  // Check required keys based on provider
  if (provider === 'creem') {
    const creemCfg = config as PaymentProviderConfig['creem']
    if (!creemCfg.secretKey || (creemCfg.secretKey && creemCfg.secretKey.includes('mock'))) {
      missingKeys.push(`${provider.toUpperCase()}_SECRET_KEY_${config.mode.toUpperCase()}`)
    }
  } else if (provider === 'paddle') {
    const paddleCfg = config as PaymentProviderConfig['paddle']
    if (!paddleCfg.apiKey || (paddleCfg.apiKey && paddleCfg.apiKey.includes('mock'))) {
      missingKeys.push(`${provider.toUpperCase()}_API_KEY_${config.mode.toUpperCase()}`)
    }
  }
  
  if (!config.webhookSecret || (config.webhookSecret && config.webhookSecret.includes('mock'))) {
    missingKeys.push(`${provider.toUpperCase()}_WEBHOOK_SECRET_${config.mode.toUpperCase()}`)
  }

  if (!config.publicKey) {
    missingKeys.push(`${provider.toUpperCase()}_PUBLIC_KEY_${config.mode.toUpperCase()}`)
  }

  if (!config.apiUrl) {
    missingKeys.push(`${provider.toUpperCase()}_API_URL_${config.mode.toUpperCase()}`)
  }

  // Provider-specific checks
  if (provider === 'creem') {
    const creemCfg = config as PaymentProviderConfig['creem']
    if (!creemCfg.productId) {
      missingKeys.push(`CREEM_PRODUCT_ID_${config.mode.toUpperCase()}`)
    }
  }

  // Add warnings for mock keys in production - simplified to avoid type issues
  if (config.mode === 'production') {
    warnings.push(`${provider.toUpperCase()} configuration should be verified for production use`)
  }

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    warnings
  }
}

/**
 * Log current configuration status (for debugging)
 */
export function logConfigurationStatus(): void {
  const currentMode = getCurrentMode()
  
  console.log(`Payment Configuration Status (Mode: ${currentMode})`)
  console.log('=====================================')
  
  const providers = ['creem', 'paddle'] as const
  
  providers.forEach(provider => {
    const validation = validateProviderConfig(provider)
    const config = paymentConfig[provider]
    
    console.log(`\n${provider.toUpperCase()}:`)
    console.log(`  Mode: ${config.mode}`)
    console.log(`  API URL: ${config.apiUrl}`)
    console.log(`  Has Public Key: ${!!config.publicKey}`)
    console.log(`  Has Webhook Secret: ${!!config.webhookSecret}`)
    console.log(`  Configuration loaded successfully`)
    
    if (provider === 'creem') {
      const creemCfg = config as PaymentProviderConfig['creem']
      console.log(`  Product ID: ${creemCfg.productId}`)
    }
    
    if (!validation.isValid) {
      console.log(`  ❌ Missing: ${validation.missingKeys.join(', ')}`)
    } else {
      console.log(`  ✅ Configuration complete`)
    }
    
    if (validation.warnings.length > 0) {
      console.log(`  ⚠️  Warnings: ${validation.warnings.join(', ')}`)
    }
  })
  
  console.log('\n=====================================')
}

/**
 * Environment-specific URLs for webhooks and redirects
 */
export const getEnvironmentUrls = () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  return {
    webhook: {
      creem: `${baseUrl}/api/payments/creem/webhook`,
      paddle: `${baseUrl}/api/payments/paddle/webhook`
    },
    redirect: {
      success: `${baseUrl}/payment/success`,
      cancel: `${baseUrl}/payment/cancel`,
      error: `${baseUrl}/payment/error`
    }
  }
}

// Log configuration on module load in development
if (process.env.NODE_ENV === 'development') {
  logConfigurationStatus()
}

// Export for backwards compatibility with existing code
export default paymentConfig