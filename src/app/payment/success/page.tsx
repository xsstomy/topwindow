'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Download, Mail, ArrowRight, RefreshCw } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'

interface PaymentStatusData {
  payment: {
    id: string
    amount: number
    currency: string
    status: string
    product_info: {
      name: string
      features: string[]
    }
    customer_info: {
      email: string
      name?: string
    }
    completed_at: string
  }
  license?: {
    license_key: string
    status: string
    expires_at: string | null
  }
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  
  const [paymentData, setPaymentData] = useState<PaymentStatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(10)

  const paymentId = searchParams.get('payment_id')
  const provider = searchParams.get('provider')

  useEffect(() => {
    if (!paymentId) {
      setError('Missing payment information')
      setLoading(false)
      return
    }

    fetchPaymentStatus()
  }, [paymentId])

  // 倒计时自动跳转
  useEffect(() => {
    if (paymentData && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (countdown === 0 && user) {
      router.push('/dashboard')
    }
  }, [countdown, paymentData, user, router])

  const fetchPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payments/status?payment_id=${paymentId}`)
      const data = await response.json()

      if (response.ok && data.status === 'success') {
        setPaymentData(data.data)
      } else {
        setError(data.message || 'Failed to fetch payment status')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyLicenseKey = () => {
    if (paymentData?.license?.license_key) {
      navigator.clipboard.writeText(paymentData.license.license_key)
      // 可以添加复制成功的提示
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <RefreshCw className="w-12 h-12 text-green-500 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">处理支付信息</h2>
            <p className="text-gray-600 text-center">正在验证您的支付状态，请稍候...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-red-600 text-2xl">❌</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">处理失败</h2>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <button
              onClick={fetchPaymentStatus}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-gray-600 text-2xl">❓</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">支付信息不存在</h2>
            <p className="text-gray-600 text-center">未找到相关的支付记录</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* 成功提示 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* 头部 */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 px-8 py-12 text-center">
              <CheckCircle className="w-20 h-20 text-white mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-2">🎉 支付成功！</h1>
              <p className="text-green-100 text-lg">
                感谢您购买 {paymentData.payment.product_info.name}
              </p>
            </div>

            {/* 内容区域 */}
            <div className="p-8">
              {/* 支付详情 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 支付详情</h3>
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">产品</span>
                    <span className="font-medium">{paymentData.payment.product_info.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">金额</span>
                    <span className="font-medium">
                      {formatAmount(paymentData.payment.amount, paymentData.payment.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">支付方式</span>
                    <span className="font-medium capitalize">{provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">完成时间</span>
                    <span className="font-medium">{formatDate(paymentData.payment.completed_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">状态</span>
                    <span className="font-medium text-green-600">✅ 已完成</span>
                  </div>
                </div>
              </div>

              {/* 许可证信息 */}
              {paymentData.license ? (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🔑 您的许可证</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="text-sm text-blue-700 mb-2">许可证密钥</div>
                    <div className="bg-white border border-blue-300 rounded-lg p-4 mb-4">
                      <code className="text-lg font-mono text-blue-900 break-all">
                        {paymentData.license.license_key}
                      </code>
                    </div>
                    <button
                      onClick={copyLicenseKey}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                    >
                      📋 复制许可证
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">许可证正在生成</span>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      您的许可证将在几分钟内通过邮件发送到 {paymentData.payment.customer_info.email}
                    </p>
                  </div>
                </div>
              )}

              {/* 产品功能 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ 产品功能</h3>
                <div className="grid gap-2">
                  {paymentData.payment.product_info.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 下一步操作 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📱 下一步操作</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">下载 TopWindow 应用</div>
                      <div className="text-sm text-gray-600">获取最新版本的 TopWindow 应用</div>
                    </div>
                    <Download className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">激活您的许可证</div>
                      <div className="text-sm text-gray-600">在应用中输入您的许可证密钥</div>
                    </div>
                    <span className="text-2xl">🔑</span>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">开始使用</div>
                      <div className="text-sm text-gray-600">享受强大的窗口管理功能</div>
                    </div>
                    <span className="text-2xl">🚀</span>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://github.com/TopWindow/TopWindow/releases/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  下载 TopWindow
                </a>
                
                {user && (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    前往仪表板 ({countdown}s)
                  </button>
                )}
              </div>

              {/* 帮助信息 */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">
                  需要帮助？请查看我们的
                  <a href="/help" className="text-blue-600 hover:text-blue-700 ml-1">帮助文档</a>
                  或联系
                  <a href="mailto:support@topwindow.app" className="text-blue-600 hover:text-blue-700 ml-1">技术支持</a>
                </p>
                <p className="text-xs text-gray-500">
                  支付 ID: {paymentData.payment.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// TESTING-GUIDE: 需覆盖用例
// 1. 支付状态获取 - 成功/失败/网络错误
// 2. 许可证显示 - 有许可证/无许可证/生成中
// 3. 自动跳转 - 倒计时功能/用户交互
// 4. 复制功能 - 许可证复制到剪贴板
// 5. 响应式设计 - 不同屏幕尺寸的适配