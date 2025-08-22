'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AlertTriangle, RefreshCw, CreditCard, ArrowLeft, Copy, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

interface PaymentErrorData {
  payment_id?: string
  provider?: string
  error_code?: string
  error_message?: string
}

interface ErrorSolution {
  code: string
  title: string
  description: string
  solutions: string[]
  severity: 'low' | 'medium' | 'high'
}

export default function PaymentErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [errorData, setErrorData] = useState<PaymentErrorData>({})
  const [copying, setCopying] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const paymentId = searchParams.get('payment_id')
    const provider = searchParams.get('provider')
    const errorCode = searchParams.get('error_code')
    const errorMessage = searchParams.get('error_message')

    setErrorData({
      payment_id: paymentId || undefined,
      provider: provider || undefined,
      error_code: errorCode || undefined,
      error_message: errorMessage || undefined
    })
  }, [searchParams])

  const getErrorSolution = (errorCode?: string): ErrorSolution => {
    const errorSolutions: Record<string, ErrorSolution> = {
      'CARD_DECLINED': {
        code: 'CARD_DECLINED',
        title: '银行卡被拒绝',
        description: '您的银行卡交易被银行或发卡机构拒绝',
        solutions: [
          '检查银行卡信息是否正确（卡号、有效期、CVV码）',
          '确认银行卡余额充足',
          '联系您的银行确认是否有交易限制',
          '尝试使用其他银行卡或支付方式'
        ],
        severity: 'medium'
      },
      'INSUFFICIENT_FUNDS': {
        code: 'INSUFFICIENT_FUNDS',
        title: '余额不足',
        description: '银行卡可用余额不足以完成此次交易',
        solutions: [
          '检查银行卡余额是否充足',
          '考虑交易可能的预授权冻结金额',
          '使用其他有足够余额的银行卡',
          '联系银行确认账户状态'
        ],
        severity: 'low'
      },
      'EXPIRED_CARD': {
        code: 'EXPIRED_CARD',
        title: '银行卡已过期',
        description: '您使用的银行卡已经过期',
        solutions: [
          '检查银行卡有效期是否正确',
          '使用未过期的银行卡',
          '联系银行申请新卡',
          '使用其他支付方式'
        ],
        severity: 'low'
      },
      'INVALID_CVC': {
        code: 'INVALID_CVC',
        title: 'CVV码错误',
        description: '银行卡背面的CVV安全码输入错误',
        solutions: [
          '检查银行卡背面3位数字的CVV码',
          '确保没有输入错误或遗漏',
          '如果是American Express卡，CVV码可能是4位数',
          '尝试重新输入或使用其他银行卡'
        ],
        severity: 'low'
      },
      'PROCESSING_ERROR': {
        code: 'PROCESSING_ERROR',
        title: '处理错误',
        description: '支付处理过程中发生技术错误',
        solutions: [
          '稍后重试支付',
          '检查网络连接是否稳定',
          '清除浏览器缓存和Cookie',
          '尝试使用其他浏览器或设备'
        ],
        severity: 'medium'
      },
      'RATE_LIMIT_EXCEEDED': {
        code: 'RATE_LIMIT_EXCEEDED',
        title: '请求过于频繁',
        description: '短时间内尝试支付次数过多',
        solutions: [
          '等待10-15分钟后重试',
          '确保只进行一次支付操作',
          '避免重复提交支付请求',
          '联系客服获取帮助'
        ],
        severity: 'low'
      },
      'GATEWAY_TIMEOUT': {
        code: 'GATEWAY_TIMEOUT',
        title: '网关超时',
        description: '支付网关响应超时',
        solutions: [
          '检查网络连接稳定性',
          '稍后重试支付',
          '尝试使用其他网络环境',
          '联系客服确认支付状态'
        ],
        severity: 'medium'
      }
    }

    return errorSolutions[errorCode || ''] || {
      code: 'UNKNOWN_ERROR',
      title: '未知错误',
      description: '支付过程中发生了未知错误',
      solutions: [
        '请稍后重试支付',
        '检查网络连接',
        '尝试使用其他支付方式',
        '联系客服获取帮助'
      ],
      severity: 'high'
    }
  }

  const errorSolution = getErrorSolution(errorData.error_code)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-600 bg-yellow-100'
      case 'medium': return 'text-orange-600 bg-orange-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return '容易解决'
      case 'medium': return '需要注意'
      case 'high': return '需要协助'
      default: return '未知'
    }
  }

  const handleRetryPayment = () => {
    router.push('/pricing')
  }

  const copyErrorDetails = async () => {
    setCopying(true)
    const details = `
错误详情：
- 支付ID: ${errorData.payment_id || 'N/A'}
- 支付方式: ${errorData.provider || 'N/A'}
- 错误代码: ${errorData.error_code || 'N/A'}
- 错误信息: ${errorData.error_message || 'N/A'}
- 时间: ${new Date().toLocaleString('zh-CN')}
    `.trim()

    try {
      await navigator.clipboard.writeText(details)
      setTimeout(() => setCopying(false), 2000)
    } catch (err) {
      setCopying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* 主要内容 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* 头部 */}
            <div className="bg-gradient-to-r from-red-500 to-orange-600 px-8 py-12 text-center">
              <AlertTriangle className="w-20 h-20 text-white mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-2">支付遇到问题</h1>
              <p className="text-red-100 text-lg">
                您的支付无法完成，但我们会帮您解决
              </p>
            </div>

            {/* 内容区域 */}
            <div className="p-8">
              {/* 错误信息 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">❗ 错误信息</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(errorSolution.severity)}`}>
                    {getSeverityText(errorSolution.severity)}
                  </span>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-red-900 mb-2">{errorSolution.title}</h4>
                  <p className="text-red-700 text-sm mb-3">{errorSolution.description}</p>
                  {errorData.error_message && (
                    <div className="bg-white border border-red-300 rounded-lg p-3">
                      <p className="text-red-600 text-sm font-mono">{errorData.error_message}</p>
                    </div>
                  )}
                </div>

                {/* 错误详情 */}
                {errorData.payment_id && (
                  <div>
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-4"
                    >
                      <span className={`transform transition-transform ${showDetails ? 'rotate-90' : ''}`}>▶</span>
                      查看错误详情
                    </button>

                    {showDetails && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">支付ID:</span>
                            <span className="font-mono">{errorData.payment_id}</span>
                          </div>
                          {errorData.provider && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">支付方式:</span>
                              <span className="capitalize">{errorData.provider}</span>
                            </div>
                          )}
                          {errorData.error_code && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">错误代码:</span>
                              <span className="font-mono">{errorData.error_code}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">发生时间:</span>
                            <span>{new Date().toLocaleString('zh-CN')}</span>
                          </div>
                        </div>
                        <button
                          onClick={copyErrorDetails}
                          className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                          disabled={copying}
                        >
                          <Copy className="w-4 h-4" />
                          {copying ? '已复制!' : '复制错误详情'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 解决方案 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 解决方案</h3>
                <div className="space-y-3">
                  {errorSolution.solutions.map((solution, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-blue-800 text-sm">{solution}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleRetryPayment}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  重新尝试支付
                </button>
                
                <button
                  onClick={() => router.push('/pricing')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  选择其他支付方式
                </button>
              </div>

              {/* 替代支付方式 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💳 其他支付选项</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">💳</span>
                      <span className="font-medium">信用卡/借记卡</span>
                    </div>
                    <p className="text-sm text-gray-600">支持 Visa、MasterCard、American Express</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🟦</span>
                      <span className="font-medium">PayPal</span>
                    </div>
                    <p className="text-sm text-gray-600">安全便捷的在线支付</p>
                  </div>
                </div>
              </div>

              {/* 客服支持 */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    需要人工协助？
                  </h4>
                  <p className="text-purple-800 text-sm mb-4">
                    如果问题仍然存在，我们的客服团队随时为您提供专业帮助
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="mailto:support@topwindow.app"
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      support@topwindow.app
                    </a>
                    <div className="flex items-center gap-2 text-purple-600 font-medium">
                      <Phone className="w-4 h-4" />
                      在线客服 (9:00-18:00)
                    </div>
                  </div>
                </div>
              </div>

              {/* 常见问题快速链接 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 相关帮助</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href="/help/payment" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-xl">💡</span>
                    <span className="text-sm font-medium text-gray-700">支付问题排查</span>
                  </Link>
                  <Link href="/help/refund" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-xl">💰</span>
                    <span className="text-sm font-medium text-gray-700">退款政策</span>
                  </Link>
                  <Link href="/help/security" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-xl">🔒</span>
                    <span className="text-sm font-medium text-gray-700">支付安全</span>
                  </Link>
                  <Link href="/help/faq" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-xl">❓</span>
                    <span className="text-sm font-medium text-gray-700">常见问题</span>
                  </Link>
                </div>
              </div>

              {/* 返回选项 */}
              <div className="text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回首页
                </Link>
              </div>
            </div>
          </div>

          {/* 安全保障说明 */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
              🔒 您的支付安全
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-3">
                <div className="text-2xl mb-2">🛡️</div>
                <div className="font-medium text-gray-900 mb-1">银行级加密</div>
                <div className="text-sm text-gray-600">所有数据传输都经过加密保护</div>
              </div>
              <div className="p-3">
                <div className="text-2xl mb-2">🔐</div>
                <div className="font-medium text-gray-900 mb-1">不存储卡信息</div>
                <div className="text-sm text-gray-600">我们不会保存您的银行卡信息</div>
              </div>
              <div className="p-3">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-medium text-gray-900 mb-1">PCI DSS 认证</div>
                <div className="text-sm text-gray-600">符合国际支付安全标准</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// TESTING-GUIDE: 需覆盖用例
// 1. 错误代码解析 - 不同错误类型的正确识别和处理
// 2. 错误详情展示 - 显示/隐藏功能
// 3. 复制功能 - 错误详情复制到剪贴板
// 4. 解决方案匹配 - 根据错误代码提供对应解决方案
// 5. 页面导航 - 重试支付/其他支付方式/返回首页