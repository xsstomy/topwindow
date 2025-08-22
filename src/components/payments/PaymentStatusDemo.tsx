'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import PaymentStatusTracker from './PaymentStatusTracker'
import { PaymentStatus } from '@/types/payment-ui'
import { Play, RefreshCw } from 'lucide-react'

export default function PaymentStatusDemo() {
  const [demoStatus, setDemoStatus] = useState<PaymentStatus>(PaymentStatus.PENDING)
  const [demoPaymentId] = useState('demo-payment-' + Date.now())
  const [isAutoPlay, setIsAutoPlay] = useState(false)

  const statusOptions = [
    { value: PaymentStatus.PENDING, label: '等待中', color: 'bg-blue-500' },
    { value: PaymentStatus.PROCESSING, label: '处理中', color: 'bg-yellow-500' },
    { value: PaymentStatus.COMPLETED, label: '已完成', color: 'bg-green-500' },
    { value: PaymentStatus.FAILED, label: '失败', color: 'bg-red-500' },
    { value: PaymentStatus.CANCELLED, label: '已取消', color: 'bg-gray-500' }
  ]

  const startAutoPlay = () => {
    setIsAutoPlay(true)
    const statuses = [
      PaymentStatus.PENDING,
      PaymentStatus.PROCESSING,
      PaymentStatus.COMPLETED
    ]
    
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < statuses.length) {
        setDemoStatus(statuses[currentIndex])
        currentIndex++
      } else {
        clearInterval(interval)
        setIsAutoPlay(false)
      }
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <motion.div 
        className="bg-white border border-gray-200 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          支付状态演示控制
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 状态选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              选择状态:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDemoStatus(option.value)}
                  disabled={isAutoPlay}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    demoStatus === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } disabled:opacity-50`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 自动演示 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              自动演示:
            </label>
            <div className="space-y-3">
              <button
                onClick={startAutoPlay}
                disabled={isAutoPlay}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isAutoPlay ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    演示进行中...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    开始自动演示
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-600">
                自动演示完整的支付流程：等待 → 处理 → 完成
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 状态跟踪器展示 */}
      <motion.div
        key={demoStatus}
        initial={{ opacity: 0.8, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <PaymentStatusTracker
          paymentId={demoPaymentId}
          autoRefresh={false}
          onStatusChange={(status) => {
            console.log('Demo status changed:', status)
          }}
        />
      </motion.div>

      {/* 状态说明 */}
      <motion.div 
        className="bg-gray-50 border border-gray-200 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h4 className="font-semibold text-gray-900 mb-3">状态说明</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statusOptions.map((option) => (
            <div key={option.value} className="flex items-start gap-3">
              <div className={`w-4 h-4 rounded-full ${option.color} mt-0.5 flex-shrink-0`}></div>
              <div>
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">
                  {getStatusDescription(option.value)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function getStatusDescription(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.PENDING:
      return '支付已发起，等待用户在支付平台完成操作'
    case PaymentStatus.PROCESSING:
      return '支付平台正在处理用户的支付信息'
    case PaymentStatus.COMPLETED:
      return '支付成功完成，许可证已生成并发送'
    case PaymentStatus.FAILED:
      return '支付失败，可能是支付被拒绝或出现技术错误'
    case PaymentStatus.CANCELLED:
      return '用户主动取消了支付操作'
    default:
      return '未知状态'
  }
}