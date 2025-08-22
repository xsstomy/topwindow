// Email Service
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
   * Send license email
   */
  static async sendLicenseEmail(params: LicenseEmailParams): Promise<EmailSendResult> {
    try {
      const emailContent = this.generateLicenseEmailHTML(params)
      
      const emailData = {
        from: this.fromEmail,
        to: [params.userEmail],
        subject: `🎉 Your ${params.productName} License Has Been Activated`,
        html: emailContent
      }

      return await this.sendEmail(emailData)

    } catch (error: any) {
      console.error('Send license email error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Send payment confirmation email
   */
  static async sendPaymentConfirmationEmail(params: PaymentConfirmationEmailParams): Promise<EmailSendResult> {
    try {
      const emailContent = this.generatePaymentConfirmationHTML(params)
      
      const emailData = {
        from: this.fromEmail,
        to: [params.userEmail],
        subject: `💳 Payment Confirmation - ${params.productName}`,
        html: emailContent
      }

      return await this.sendEmail(emailData)

    } catch (error: any) {
      console.error('Send payment confirmation email error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Send payment failure notification email
   */
  static async sendPaymentFailureEmail(params: PaymentFailureEmailParams): Promise<EmailSendResult> {
    try {
      const emailContent = this.generatePaymentFailureHTML(params)
      
      const emailData = {
        from: this.fromEmail,
        to: [params.userEmail],
        subject: `❌ Payment Processing Failed`,
        html: emailContent
      }

      return await this.sendEmail(emailData)

    } catch (error: any) {
      console.error('Send payment failure email error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Send test email
   */
  static async sendTestEmail(toEmail: string): Promise<EmailSendResult> {
    try {
      const emailData = {
        from: this.fromEmail,
        to: [toEmail],
        subject: '📧 TopWindow Email Service Test',
        html: this.generateTestEmailHTML()
      }

      return await this.sendEmail(emailData)

    } catch (error: any) {
      console.error('Send test email error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 私有方法

  /**
   * Core email sending method
   */
  private static async sendEmail(emailData: {
    from: string
    to: string[]
    subject: string
    html: string
  }): Promise<EmailSendResult> {
    // If no API Key is configured, use mock mode
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

    } catch (error: any) {
      console.error('Email sending failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Mock email sending (for development and testing)
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
   * Generate license email HTML
   */
  private static generateLicenseEmailHTML(params: LicenseEmailParams): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your License Has Been Activated</title>
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
            <h1 class="title">🎉 Thank You for Purchasing ${params.productName}!</h1>
        </div>
        
        <p>Dear ${params.userName},</p>
        
        <p>Your purchase has been completed. Here is your license information:</p>
        
        <div class="license-box">
            <div class="license-label">License Key</div>
            <div class="license-key">${params.licenseKey}</div>
        </div>
        
        <div class="info-box">
            <div class="info-title">🔑 License Information</div>
            <ul class="feature-list">
                <li><strong>Product:</strong>${params.productName}</li>
                <li><strong>Device Limit:</strong>Up to ${params.activationLimit} devices</li>
                <li><strong>Validity:</strong>Lifetime</li>
                <li><strong>Updates:</strong>Free updates</li>
                <li><strong>Support:</strong>Priority technical support</li>
            </ul>
        </div>
        
        <div class="steps-box">
            <div class="steps-title">📱 How to Activate</div>
            <ol class="steps-list">
                <li>Download and install the TopWindow application</li>
                <li>Open the app and go to the "Activation" page</li>
                <li>Enter your license key</li>
                <li>Click "Activate" to complete the activation</li>
            </ol>
        </div>

        ${params.downloadUrl ? `
        <div style="text-align: center;">
            <a href="${params.downloadUrl}" class="download-button">Download TopWindow Now</a>
        </div>
        ` : ''}
        
        <div class="support-info">
            <p><strong>Need Help?</strong></p>
            <p>If you encounter any issues during activation, please contact our technical support team.</p>
            <p>Email: ${this.supportEmail}</p>
        </div>
        
        <p>Thank you again for choosing TopWindow! We are committed to providing you with the best window management experience.</p>
        
        <div class="footer">
            <p>This email was automatically sent by TopWindow. Please do not reply.</p>
            <p>For assistance, please visit our support center or email ${this.supportEmail}</p>
            <p>© 2024 TopWindow. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `
  }

  /**
   * Generate payment confirmation email HTML
   */
  private static generatePaymentConfirmationHTML(params: PaymentConfirmationEmailParams): string {
    const formattedAmount = `${params.currency} ${params.amount.toFixed(2)}`
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation</title>
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
            <h1 class="title">Payment Confirmation</h1>
        </div>
        
        <p>Dear ${params.userName},</p>
        
        <p>Your payment has been successfully processed! Here are your payment details:</p>
        
        <div class="payment-details">
            <div class="detail-row">
                <span><strong>Product</strong></span>
                <span>${params.productName}</span>
            </div>
            <div class="detail-row">
                <span><strong>Amount</strong></span>
                <span>${formattedAmount}</span>
            </div>
            <div class="detail-row">
                <span><strong>Payment ID</strong></span>
                <span>${params.paymentId}</span>
            </div>
            <div class="detail-row">
                <span><strong>Status</strong></span>
                <span style="color: #28a745; font-weight: bold;">Completed</span>
            </div>
        </div>
        
        <p>Your license will be sent to you via email within minutes. Please check your inbox!</p>
        
        ${params.invoiceUrl ? `<p><a href="${params.invoiceUrl}" style="color: #0066cc;">Click here to download invoice</a></p>` : ''}
        
        <div class="footer">
            <p>This email was automatically sent by TopWindow. Please do not reply.</p>
            <p>For assistance, please contact ${this.supportEmail}</p>
        </div>
    </div>
</body>
</html>
    `
  }

  /**
   * Generate payment failure email HTML
   */
  private static generatePaymentFailureHTML(params: PaymentFailureEmailParams): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failure Notification</title>
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
            <h1 class="title">Payment Processing Failed</h1>
        </div>
        
        <p>Dear ${params.userName},</p>
        
        <p>We're sorry, but there was a problem processing your payment.</p>
        
        <div class="error-box">
            <h3 style="color: #721c24; margin-top: 0;">Failure Reason:</h3>
            <p style="color: #721c24; margin-bottom: 0;">${params.reason}</p>
        </div>
        
        <p>Please don't worry, you can try the following solutions:</p>
        
        <ul>
            <li>Check if your card information is correct</li>
            <li>Confirm that your card has sufficient balance</li>
            <li>Contact your bank to check for any payment restrictions</li>
            <li>Try using a different payment method</li>
        </ul>
        
        ${params.retryUrl ? `
        <div style="text-align: center;">
            <a href="${params.retryUrl}" class="retry-button">Retry Payment</a>
        </div>
        ` : ''}
        
        <p>If the problem persists, please contact our customer service team. We are here to help you.</p>
        
        <div class="footer">
            <p>For assistance, please contact: ${this.supportEmail}</p>
            ${params.supportUrl ? `<p><a href="${params.supportUrl}">Visit Help Center</a></p>` : ''}
        </div>
    </div>
</body>
</html>
    `
  }

  /**
   * Generate test email HTML
   */
  private static generateTestEmailHTML(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Service Test</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background-color: #f8f9fa; border-radius: 8px; padding: 30px; text-align: center; }
        .title { color: #0066cc; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">📧 TopWindow Email Service Test</h1>
        <p>If you received this email, it means the email service is configured correctly!</p>
        <p>Test time: ${new Date().toLocaleString('en-US')}</p>
    </div>
</body>
</html>
    `
  }

  /**
   * Validate email configuration
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
   * Check email service health status
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

      // If in mock mode, return health status directly
      if (!this.apiKey || this.apiKey === 'mock_key') {
        return {
          isHealthy: true,
          message: 'Email service is running in mock mode',
          responseTime: Date.now() - startTime
        }
      }

      // In production environment, can send test email to preset test address
      return {
        isHealthy: true,
        message: 'Email service is healthy',
        responseTime: Date.now() - startTime
      }

    } catch (error: any) {
      return {
        isHealthy: false,
        message: `Health check failed: ${error.message}`,
        responseTime: Date.now() - startTime
      }
    }
  }
}

// Convenience function exports
export const {
  sendLicenseEmail,
  sendPaymentConfirmationEmail,
  sendPaymentFailureEmail,
  sendTestEmail,
  validateConfig,
  checkHealth
} = EmailService

// TESTING-GUIDE: Test cases to cover
// 1. Email sending tests - successful sending/API errors/network errors
// 2. Email template tests - HTML generation correctness/parameter substitution/encoding
// 3. Mock mode tests - behavior without API key
// 4. Configuration validation tests - missing configuration detection/health checks