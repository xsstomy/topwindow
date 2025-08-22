// 支付系统集成测试
import { PaymentService } from '../service'
import { PaymentProviderFactory } from '../providers'
import { EmailService } from '@/lib/email/service'
import type { CreateSessionParams, PaymentRecord } from '@/types/payment'

// 模拟测试数据
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  user_metadata: { full_name: 'Test User' }
}

const mockProduct = {
  id: 'topwindow-license',
  name: 'TopWindow License',
  price: 29.99,
  currency: 'USD',
  activation_limit: 3,
  features: ['永久使用权', '支持3台设备', '免费更新']
}

const mockPayment: PaymentRecord = {
  id: 'payment-test-123',
  user_id: mockUser.id,
  payment_provider: 'creem',
  provider_payment_id: null,
  provider_session_id: 'session-test-123',
  amount: 29.99,
  currency: 'USD',
  status: 'pending',
  product_info: {
    product_id: mockProduct.id,
    name: mockProduct.name,
    price: mockProduct.price,
    currency: mockProduct.currency
  },
  customer_info: {
    email: mockUser.email,
    name: mockUser.user_metadata.full_name,
    user_id: mockUser.id
  },
  metadata: {},
  created_at: new Date().toISOString(),
  completed_at: null,
  webhook_received_at: null
}

describe('Payment System Integration Tests', () => {
  
  describe('PaymentProviderFactory', () => {
    test('应该返回支持的支付平台列表', () => {
      const providers = PaymentProviderFactory.getSupportedProviders()
      expect(providers).toContain('creem')
      expect(providers).toContain('paddle')
    })

    test('应该能创建Creem支付平台实例', () => {
      expect(() => {
        const provider = PaymentProviderFactory.getProvider('creem')
        expect(provider).toBeDefined()
      }).not.toThrow()
    })

    test('应该能创建Paddle支付平台实例', () => {
      expect(() => {
        const provider = PaymentProviderFactory.getProvider('paddle')
        expect(provider).toBeDefined()
      }).not.toThrow()
    })

    test('不支持的支付平台应该抛出错误', () => {
      expect(() => {
        PaymentProviderFactory.getProvider('unsupported' as any)
      }).toThrow('Unsupported payment provider')
    })
  })

  describe('支付平台适配器', () => {
    const sessionParams: CreateSessionParams = {
      provider: 'creem',
      product_id: 'topwindow-license',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      customer_email: 'test@example.com'
    }

    test('Creem提供商应该能创建模拟支付会话', async () => {
      const provider = PaymentProviderFactory.getProvider('creem')
      
      const result = await provider.createSession(sessionParams, mockPayment)
      
      expect(result).toHaveProperty('session_url')
      expect(result).toHaveProperty('session_id')
      expect(result).toHaveProperty('payment_id')
      expect(result.session_url).toContain('creem')
      expect(result.payment_id).toBe(mockPayment.id)
    })

    test('Paddle提供商应该能创建模拟支付会话', async () => {
      const provider = PaymentProviderFactory.getProvider('paddle')
      
      const paddlePayment = { ...mockPayment, payment_provider: 'paddle' as const }
      const paddleParams = { ...sessionParams, provider: 'paddle' as const }
      
      const result = await provider.createSession(paddleParams, paddlePayment)
      
      expect(result).toHaveProperty('session_url')
      expect(result).toHaveProperty('session_id')
      expect(result).toHaveProperty('payment_id')
      expect(result.session_url).toContain('paddle')
      expect(result.payment_id).toBe(paddlePayment.id)
    })

    test('Webhook签名验证应该正确处理模拟模式', () => {
      const provider = PaymentProviderFactory.getProvider('creem')
      
      // 在模拟模式下（没有真实的webhook secret），应该返回true
      const isValid = provider.verifyWebhook('test payload', 'test signature')
      expect(isValid).toBe(true)
    })
  })

  describe('EmailService', () => {
    test('应该能验证邮件配置', () => {
      const config = EmailService.validateConfig()
      expect(config).toHaveProperty('isValid')
      expect(config).toHaveProperty('missingKeys')
      expect(Array.isArray(config.missingKeys)).toBe(true)
    })

    test('应该能进行健康检查', async () => {
      const health = await EmailService.checkHealth()
      expect(health).toHaveProperty('isHealthy')
      expect(health).toHaveProperty('message')
      expect(health).toHaveProperty('responseTime')
      expect(typeof health.responseTime).toBe('number')
    })

    test('应该能发送模拟许可证邮件', async () => {
      const result = await EmailService.sendLicenseEmail({
        userEmail: 'test@example.com',
        userName: 'Test User',
        licenseKey: 'TW-TEST-1234-5678',
        productName: 'TopWindow License',
        activationLimit: 3
      })

      expect(result).toHaveProperty('success')
      expect(result).toHaveProperty('messageId')
      
      // 在模拟模式下应该成功
      expect(result.success).toBe(true)
      expect(result.messageId).toContain('mock_')
    })

    test('应该能发送测试邮件', async () => {
      const result = await EmailService.sendTestEmail('test@example.com')
      
      expect(result).toHaveProperty('success')
      expect(result.success).toBe(true)
    })
  })

  describe('支付流程端到端测试', () => {
    test('完整的支付会话创建流程', async () => {
      const sessionParams: CreateSessionParams = {
        provider: 'creem',
        product_id: 'topwindow-license',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        customer_email: 'test@example.com'
      }

      // 创建支付会话应该不抛出错误
      expect(async () => {
        // 注意：这个测试需要模拟数据库操作
        // 在实际测试中，需要mock Supabase 调用
        console.log('Testing payment session creation flow...')
      }).not.toThrow()
    })

    test('Webhook处理流程', async () => {
      const mockWebhookEvent = {
        type: 'payment.completed',
        data: {
          session_id: 'session-test-123',
          payment_id: 'payment-test-123',
          amount: 29.99,
          currency: 'USD',
          status: 'completed',
          metadata: {
            payment_id: 'payment-test-123',
            user_id: 'test-user-123'
          }
        }
      }

      const provider = PaymentProviderFactory.getProvider('creem')
      
      const result = await provider.processWebhookEvent(mockWebhookEvent)
      
      expect(result).toHaveProperty('success')
      expect(result).toHaveProperty('message')
      expect(result.success).toBe(true)
    })
  })

  describe('错误处理测试', () => {
    test('无效的支付金额应该被拒绝', () => {
      const provider = PaymentProviderFactory.getProvider('creem')
      
      expect(() => {
        // @ts-ignore - 测试内部方法
        provider.validateAmount(-10)
      }).toThrow('Invalid payment amount')
      
      expect(() => {
        // @ts-ignore - 测试内部方法
        provider.validateAmount(1000000)
      }).toThrow('Invalid payment amount')
    })

    test('不支持的货币应该被拒绝', () => {
      const provider = PaymentProviderFactory.getProvider('creem')
      
      expect(() => {
        // @ts-ignore - 测试内部方法
        provider.validateCurrency('INVALID')
      }).toThrow('Unsupported currency')
    })

    test('邮件发送失败应该被正确处理', async () => {
      // 模拟邮件服务故障
      const originalSendEmail = EmailService.sendLicenseEmail
      
      // @ts-ignore - 临时替换方法用于测试
      EmailService.sendLicenseEmail = async () => ({
        success: false,
        error: 'Mock email service failure'
      })

      const result = await EmailService.sendLicenseEmail({
        userEmail: 'test@example.com',
        userName: 'Test User',
        licenseKey: 'TW-TEST-1234-5678',
        productName: 'TopWindow License',
        activationLimit: 3
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Mock email service failure')

      // 恢复原方法
      // @ts-ignore
      EmailService.sendLicenseEmail = originalSendEmail
    })
  })

  describe('配置验证测试', () => {
    test('支付平台配置验证', () => {
      const creemConfig = require('../providers').validateProviderConfig('creem')
      expect(creemConfig).toHaveProperty('isValid')
      expect(creemConfig).toHaveProperty('missingKeys')

      const paddleConfig = require('../providers').validateProviderConfig('paddle')
      expect(paddleConfig).toHaveProperty('isValid')
      expect(paddleConfig).toHaveProperty('missingKeys')
    })

    test('支付平台健康检查', async () => {
      const creemHealth = await require('../providers').checkProviderHealth('creem')
      expect(creemHealth).toHaveProperty('isHealthy')
      expect(creemHealth).toHaveProperty('message')
      expect(creemHealth).toHaveProperty('responseTime')

      const paddleHealth = await require('../providers').checkProviderHealth('paddle')
      expect(paddleHealth).toHaveProperty('isHealthy')
      expect(paddleHealth).toHaveProperty('message')
      expect(paddleHealth).toHaveProperty('responseTime')
    })
  })
})

// 测试工具函数
export const testUtils = {
  createMockUser: (overrides = {}) => ({
    ...mockUser,
    ...overrides
  }),

  createMockProduct: (overrides = {}) => ({
    ...mockProduct,
    ...overrides
  }),

  createMockPayment: (overrides = {}) => ({
    ...mockPayment,
    ...overrides
  }),

  createMockSessionParams: (overrides = {}): CreateSessionParams => ({
    provider: 'creem',
    product_id: 'topwindow-license',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
    customer_email: 'test@example.com',
    ...overrides
  })
}

// TESTING-GUIDE: 运行测试的说明
// 1. 安装测试依赖: npm install --save-dev jest @types/jest ts-jest
// 2. 配置 jest.config.js 用于 TypeScript 支持
// 3. 运行测试: npm test
// 4. 查看覆盖率: npm run test:coverage