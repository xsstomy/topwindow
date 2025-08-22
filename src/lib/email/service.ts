// 邮件发送服务
import type {
  LicenseEmailParams,
  PaymentConfirmationEmailParams,
  PaymentFailureEmailParams,
  EmailSendResult
} from '@/types/payment'

export class EmailService {
  private static readonly apiKey = process.env.RESEND_API_KEY || ''
  private static readonly fromEmail = process.env.FROM_EMAIL || 'noreply@topwindow.app'
  private static readonly supportEmail = process.env.SUPPORT_EMAIL || 'support@topwindow.app'
  private static readonly apiUrl = 'https://api.resend.com/emails'

  /**
   * 发送许可证邮件
   */
  static async sendLicenseEmail(params: LicenseEmailParams): Promise<EmailSendResult> {
    try {
      const emailContent = this.generateLicenseEmailHTML(params)
      
      const emailData = {
        from: this.fromEmail,
        to: [params.userEmail],
        subject: `🎉 您的 ${params.productName} 许可证已激活`,
        html: emailContent
      }

      return await this.sendEmail(emailData)

    } catch (error) {
      console.error('Send license email error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 发送支付确认邮件
   */
  static async sendPaymentConfirmationEmail(params: PaymentConfirmationEmailParams): Promise<EmailSendResult> {
    try {
      const emailContent = this.generatePaymentConfirmationHTML(params)
      
      const emailData = {
        from: this.fromEmail,
        to: [params.userEmail],
        subject: `💳 支付成功确认 - ${params.productName}`,
        html: emailContent
      }

      return await this.sendEmail(emailData)

    } catch (error) {
      console.error('Send payment confirmation email error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 发送支付失败通知邮件
   */
  static async sendPaymentFailureEmail(params: PaymentFailureEmailParams): Promise<EmailSendResult> {
    try {
      const emailContent = this.generatePaymentFailureHTML(params)
      
      const emailData = {
        from: this.fromEmail,
        to: [params.userEmail],
        subject: `❌ 支付处理失败通知`,
        html: emailContent
      }

      return await this.sendEmail(emailData)

    } catch (error) {
      console.error('Send payment failure email error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 发送测试邮件
   */
  static async sendTestEmail(toEmail: string): Promise<EmailSendResult> {
    try {
      const emailData = {
        from: this.fromEmail,
        to: [toEmail],
        subject: '📧 TopWindow 邮件服务测试',
        html: this.generateTestEmailHTML()
      }

      return await this.sendEmail(emailData)

    } catch (error) {
      console.error('Send test email error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 私有方法

  /**
   * 核心邮件发送方法
   */
  private static async sendEmail(emailData: {
    from: string
    to: string[]
    subject: string
    html: string
  }): Promise<EmailSendResult> {
    // 如果没有配置 API Key，使用模拟模式
    if (!this.apiKey || this.apiKey === 'mock_key') {
      return this.mockSendEmail(emailData)
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Email API error (${response.status}): ${errorData}`)
      }

      const result = await response.json()
      console.log(`Email sent successfully to ${emailData.to[0]}, ID: ${result.id}`)

      return {
        success: true,
        messageId: result.id
      }

    } catch (error) {
      console.error('Email sending failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 模拟邮件发送 (用于开发和测试)
   */
  private static mockSendEmail(emailData: {
    from: string
    to: string[]
    subject: string
    html: string
  }): EmailSendResult {
    const mockId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    console.log('📧 [MOCK EMAIL SENT]')
    console.log(`From: ${emailData.from}`)
    console.log(`To: ${emailData.to.join(', ')}`)
    console.log(`Subject: ${emailData.subject}`)
    console.log(`Message ID: ${mockId}`)
    console.log('---')

    return {
      success: true,
      messageId: mockId
    }
  }

  /**
   * 生成许可证邮件 HTML
   */
  private static generateLicenseEmailHTML(params: LicenseEmailParams): string {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>您的许可证已激活</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #0066cc;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .license-box {
            background-color: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        .license-label {
            font-size: 16px;
            font-weight: 600;
            color: #495057;
            margin-bottom: 10px;
        }
        .license-key {
            font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
            font-size: 20px;
            font-weight: bold;
            color: #0066cc;
            background-color: white;
            padding: 12px 20px;
            border-radius: 6px;
            border: 1px solid #dee2e6;
            letter-spacing: 2px;
            word-break: break-all;
        }
        .info-box {
            background-color: #e8f4fd;
            border-left: 4px solid #0066cc;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        .info-title {
            font-size: 18px;
            font-weight: 600;
            color: #0066cc;
            margin-bottom: 15px;
        }
        .feature-list {
            list-style: none;
            padding: 0;
            margin: 15px 0;
        }
        .feature-list li {
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .feature-list li:last-child {
            border-bottom: none;
        }
        .steps-box {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .steps-title {
            font-size: 18px;
            font-weight: 600;
            color: #856404;
            margin-bottom: 15px;
        }
        .steps-list {
            padding-left: 20px;
            margin: 0;
        }
        .steps-list li {
            margin-bottom: 8px;
            color: #856404;
        }
        .download-button {
            display: inline-block;
            background-color: #0066cc;
            color: white;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
        }
        .support-info {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
            text-align: center;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
            text-align: center;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .container {
                padding: 20px;
            }
            .license-key {
                font-size: 16px;
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">TopWindow</div>
            <h1 class="title">🎉 感谢您购买 ${params.productName}！</h1>
        </div>
        
        <p>亲爱的 ${params.userName}，</p>
        
        <p>您的购买已完成，以下是您的许可证信息：</p>
        
        <div class="license-box">
            <div class="license-label">许可证密钥</div>
            <div class="license-key">${params.licenseKey}</div>
        </div>
        
        <div class="info-box">
            <div class="info-title">🔑 许可证信息</div>
            <ul class="feature-list">
                <li><strong>产品：</strong>${params.productName}</li>
                <li><strong>设备限制：</strong>最多 ${params.activationLimit} 台设备</li>
                <li><strong>有效期：</strong>永久</li>
                <li><strong>更新：</strong>免费更新</li>
                <li><strong>技术支持：</strong>优先技术支持</li>
            </ul>
        </div>
        
        <div class="steps-box">
            <div class="steps-title">📱 如何激活</div>
            <ol class="steps-list">
                <li>下载并安装 TopWindow 应用</li>
                <li>打开应用，进入"激活"页面</li>
                <li>输入您的许可证密钥</li>
                <li>点击"激活"完成激活</li>
            </ol>
        </div>

        ${params.downloadUrl ? `
        <div style="text-align: center;">
            <a href="${params.downloadUrl}" class="download-button">立即下载 TopWindow</a>
        </div>
        ` : ''}
        
        <div class="support-info">
            <p><strong>需要帮助？</strong></p>
            <p>如果您在激活过程中遇到任何问题，请随时联系我们的技术支持团队。</p>
            <p>邮箱：${this.supportEmail}</p>
        </div>
        
        <p>再次感谢您选择 TopWindow！我们致力于为您提供最佳的窗口管理体验。</p>
        
        <div class="footer">
            <p>此邮件由 TopWindow 自动发送，请勿回复。</p>
            <p>如需帮助，请访问我们的支持中心或发送邮件至 ${this.supportEmail}</p>
            <p>© 2024 TopWindow. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `
  }

  /**
   * 生成支付确认邮件 HTML
   */
  private static generatePaymentConfirmationHTML(params: PaymentConfirmationEmailParams): string {
    const formattedAmount = `${params.currency} ${params.amount.toFixed(2)}`
    
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>支付确认</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .container { background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #28a745; margin-bottom: 10px; }
        .title { font-size: 24px; color: #2c3e50; margin-bottom: 20px; }
        .payment-details { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
        .detail-row:last-child { border-bottom: none; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">✅ TopWindow</div>
            <h1 class="title">支付成功确认</h1>
        </div>
        
        <p>亲爱的 ${params.userName}，</p>
        
        <p>您的支付已成功处理！以下是您的支付详情：</p>
        
        <div class="payment-details">
            <div class="detail-row">
                <span><strong>产品</strong></span>
                <span>${params.productName}</span>
            </div>
            <div class="detail-row">
                <span><strong>金额</strong></span>
                <span>${formattedAmount}</span>
            </div>
            <div class="detail-row">
                <span><strong>支付ID</strong></span>
                <span>${params.paymentId}</span>
            </div>
            <div class="detail-row">
                <span><strong>状态</strong></span>
                <span style="color: #28a745; font-weight: bold;">已完成</span>
            </div>
        </div>
        
        <p>您的许可证将在几分钟内通过邮件发送给您。请注意查收！</p>
        
        ${params.invoiceUrl ? `<p><a href="${params.invoiceUrl}" style="color: #0066cc;">点击这里下载发票</a></p>` : ''}
        
        <div class="footer">
            <p>此邮件由 TopWindow 自动发送，请勿回复。</p>
            <p>如需帮助，请联系 ${this.supportEmail}</p>
        </div>
    </div>
</body>
</html>
    `
  }

  /**
   * 生成支付失败邮件 HTML
   */
  private static generatePaymentFailureHTML(params: PaymentFailureEmailParams): string {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>支付失败通知</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .container { background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #dc3545; margin-bottom: 10px; }
        .title { font-size: 24px; color: #2c3e50; margin-bottom: 20px; }
        .error-box { background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .retry-button { display: inline-block; background-color: #0066cc; color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">❌ TopWindow</div>
            <h1 class="title">支付处理失败</h1>
        </div>
        
        <p>亲爱的 ${params.userName}，</p>
        
        <p>很抱歉，您的支付处理过程中出现了问题。</p>
        
        <div class="error-box">
            <h3 style="color: #721c24; margin-top: 0;">失败原因：</h3>
            <p style="color: #721c24; margin-bottom: 0;">${params.reason}</p>
        </div>
        
        <p>请不用担心，您可以尝试以下解决方案：</p>
        
        <ul>
            <li>检查您的银行卡信息是否正确</li>
            <li>确认银行卡余额充足</li>
            <li>联系您的银行确认是否有支付限制</li>
            <li>尝试使用其他支付方式</li>
        </ul>
        
        ${params.retryUrl ? `
        <div style="text-align: center;">
            <a href="${params.retryUrl}" class="retry-button">重新尝试支付</a>
        </div>
        ` : ''}
        
        <p>如果问题仍然存在，请联系我们的客服团队，我们将竭诚为您提供帮助。</p>
        
        <div class="footer">
            <p>如需帮助，请联系：${this.supportEmail}</p>
            ${params.supportUrl ? `<p><a href="${params.supportUrl}">访问帮助中心</a></p>` : ''}
        </div>
    </div>
</body>
</html>
    `
  }

  /**
   * 生成测试邮件 HTML
   */
  private static generateTestEmailHTML(): string {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>邮件服务测试</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background-color: #f8f9fa; border-radius: 8px; padding: 30px; text-align: center; }
        .title { color: #0066cc; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">📧 TopWindow 邮件服务测试</h1>
        <p>如果您收到这封邮件，说明邮件服务配置正确！</p>
        <p>测试时间：${new Date().toLocaleString('zh-CN')}</p>
    </div>
</body>
</html>
    `
  }

  /**
   * 验证邮件配置
   */
  static validateConfig(): { isValid: boolean; missingKeys: string[] } {
    const requiredKeys = ['RESEND_API_KEY', 'FROM_EMAIL']
    const missingKeys = requiredKeys.filter(key => !process.env[key])

    return {
      isValid: missingKeys.length === 0,
      missingKeys
    }
  }

  /**
   * 检查邮件服务健康状态
   */
  static async checkHealth(): Promise<{
    isHealthy: boolean
    message: string
    responseTime?: number
  }> {
    const startTime = Date.now()
    
    try {
      const config = this.validateConfig()
      
      if (!config.isValid) {
        return {
          isHealthy: false,
          message: `Missing configuration: ${config.missingKeys.join(', ')}`,
          responseTime: Date.now() - startTime
        }
      }

      // 如果是模拟模式，直接返回健康状态
      if (!this.apiKey || this.apiKey === 'mock_key') {
        return {
          isHealthy: true,
          message: 'Email service is running in mock mode',
          responseTime: Date.now() - startTime
        }
      }

      // 在生产环境中，可以发送测试邮件到预设的测试地址
      return {
        isHealthy: true,
        message: 'Email service is healthy',
        responseTime: Date.now() - startTime
      }

    } catch (error) {
      return {
        isHealthy: false,
        message: `Health check failed: ${error.message}`,
        responseTime: Date.now() - startTime
      }
    }
  }
}

// 便捷函数导出
export const {
  sendLicenseEmail,
  sendPaymentConfirmationEmail,
  sendPaymentFailureEmail,
  sendTestEmail,
  validateConfig,
  checkHealth
} = EmailService

// TESTING-GUIDE: 需覆盖用例
// 1. 邮件发送测试 - 成功发送/API错误/网络错误
// 2. 邮件模板测试 - HTML生成正确性/参数替换/中文编码
// 3. 模拟模式测试 - 无API密钥时的模拟行为
// 4. 配置验证测试 - 缺失配置检测/健康检查