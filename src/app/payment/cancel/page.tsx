'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { XCircle, ArrowLeft, CreditCard, HelpCircle, Mail } from 'lucide-react'
import Link from 'next/link'

interface PaymentCancelData {
  payment_id?: string
  provider?: string
  reason?: string
}

export default function PaymentCancelPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [paymentData, setPaymentData] = useState<PaymentCancelData>({})
  const [showFAQ, setShowFAQ] = useState(false)

  useEffect(() => {
    const paymentId = searchParams.get('payment_id')
    const provider = searchParams.get('provider')
    const reason = searchParams.get('reason')

    setPaymentData({
      payment_id: paymentId || undefined,
      provider: provider || undefined,
      reason: reason || undefined
    })
  }, [searchParams])

  const handleRetryPayment = () => {
    router.push('/pricing')
  }

  const faqs = [
    {
      question: '为什么我的支付被取消了？',
      answer: '支付可能因为以下原因被取消：用户主动取消、银行卡验证失败、网络连接中断、或支付超时。'
    },
    {
      question: '我的资金安全吗？',
      answer: '是的，取消的支付不会产生任何费用。如果您看到预授权扣款，通常会在1-3个工作日内自动退回您的账户。'
    },
    {
      question: '如何重新完成支付？',
      answer: '您可以点击"重新购买"按钮返回购买页面，重新选择支付方式完成购买。'
    },
    {
      question: '支持哪些支付方式？',
      answer: '我们支持信用卡、借记卡、PayPal等多种支付方式。建议使用稳定的网络环境进行支付。'
    }
  ]

  const commonReasons = [
    {
      title: '网络连接问题',
      description: '支付过程中网络连接不稳定',
      solution: '请检查网络连接，使用稳定的WiFi或移动网络重试'
    },
    {
      title: '银行卡信息错误',
      description: '卡号、有效期或CVV码输入错误',
      solution: '请仔细检查银行卡信息，确保所有字段都正确填写'
    },
    {
      title: '余额不足',
      description: '银行卡余额不足以完成此次支付',
      solution: '请确保银行卡有足够余额，或使用其他支付方式'
    },
    {
      title: '银行限制',
      description: '银行对在线支付有限制或需要验证',
      solution: '请联系您的银行确认在线支付功能是否开启'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* 主要内容 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* 头部 */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-12 text-center">
              <XCircle className="w-20 h-20 text-white mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-2">支付已取消</h1>
              <p className="text-orange-100 text-lg">
                您的支付过程已被取消，无需担心资金安全
              </p>
            </div>

            {/* 内容区域 */}
            <div className="p-8">
              {/* 取消信息 */}
              {paymentData.payment_id && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 取消详情</h3>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">支付ID</span>
                      <span className="font-mono text-sm">{paymentData.payment_id}</span>
                    </div>
                    {paymentData.provider && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">支付方式</span>
                        <span className="font-medium capitalize">{paymentData.provider}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">状态</span>
                      <span className="font-medium text-orange-600">❌ 已取消</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">取消时间</span>
                      <span className="font-medium">{new Date().toLocaleString('zh-CN')}</span>
                    </div>
                    {paymentData.reason && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">取消原因</span>
                        <span className="font-medium">{paymentData.reason}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 重要说明 */}
              <div className="mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">💳</span>
                    资金安全保障
                  </h4>
                  <ul className="text-blue-800 text-sm space-y-2">
                    <li>• 取消的支付不会产生任何费用</li>
                    <li>• 如有预授权扣款，将在1-3个工作日内自动退回</li>
                    <li>• 您的银行卡信息完全安全，未被保存</li>
                  </ul>
                </div>
              </div>

              {/* 常见原因 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 常见取消原因及解决方案</h3>
                <div className="space-y-4">
                  {commonReasons.map((reason, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="font-medium text-gray-900 mb-2">{reason.title}</div>
                      <div className="text-sm text-gray-600 mb-2">{reason.description}</div>
                      <div className="text-sm text-blue-600 font-medium">
                        💡 解决方案：{reason.solution}
                      </div>
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
                  <CreditCard className="w-5 h-5" />
                  重新购买
                </button>
                
                <Link
                  href="/"
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-decoration-none"
                >
                  <ArrowLeft className="w-5 h-5" />
                  返回首页
                </Link>
              </div>

              {/* FAQ 部分 */}
              <div className="mb-8">
                <button
                  onClick={() => setShowFAQ(!showFAQ)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">常见问题解答</span>
                  </div>
                  <span className={`transform transition-transform ${showFAQ ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {showFAQ && (
                  <div className="mt-4 space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-l-4 border-blue-400 pl-4 py-2">
                        <div className="font-medium text-gray-900 mb-2">{faq.question}</div>
                        <div className="text-sm text-gray-600">{faq.answer}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 联系支持 */}
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  需要帮助？
                </h4>
                <p className="text-gray-600 mb-4">
                  如果您继续遇到支付问题，我们的支持团队随时为您提供帮助
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:support@topwindow.app"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    📧 support@topwindow.app
                  </a>
                  <Link
                    href="/help"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    📚 帮助中心
                  </Link>
                </div>
              </div>

              {/* 底部信息 */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500 mb-2">
                  TopWindow - 让您的 Mac 窗口管理更高效
                </p>
                <div className="flex justify-center gap-4 text-xs text-gray-400">
                  <Link href="/privacy" className="hover:text-gray-600">隐私政策</Link>
                  <Link href="/terms" className="hover:text-gray-600">服务条款</Link>
                  <Link href="/refund" className="hover:text-gray-600">退款政策</Link>
                </div>
              </div>
            </div>
          </div>

          {/* 产品特色提醒 */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              🚀 您错过的强大功能
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="font-medium text-gray-900">快速窗口切换</div>
                  <div className="text-sm text-gray-600">一键切换任意应用窗口</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">📐</span>
                <div>
                  <div className="font-medium text-gray-900">智能窗口排列</div>
                  <div className="text-sm text-gray-600">自动整理桌面布局</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="font-medium text-gray-900">精确窗口控制</div>
                  <div className="text-sm text-gray-600">像素级精确调整</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">⚙️</span>
                <div>
                  <div className="font-medium text-gray-900">个性化设置</div>
                  <div className="text-sm text-gray-600">完全自定义体验</div>
                </div>
              </div>
            </div>
            <div className="text-center mt-6">
              <button
                onClick={handleRetryPayment}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
              >
                立即购买 - 仅需 $29.99
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// TESTING-GUIDE: 需覆盖用例
// 1. URL参数解析 - payment_id/provider/reason参数处理
// 2. FAQ交互 - 展开/收起功能
// 3. 页面导航 - 重新购买/返回首页
// 4. 响应式设计 - 移动端和桌面端适配
// 5. 链接功能 - 邮箱/帮助中心/政策页面