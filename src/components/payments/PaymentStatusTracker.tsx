'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePaymentStatus } from '@/hooks/usePayment'
import { PaymentStatusTrackerProps, PaymentStatus, PaymentStep } from '@/types/payment-ui'
import { 
  Clock, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  RefreshCw 
} from 'lucide-react'

export default function PaymentStatusTracker({ 
  paymentId, 
  onStatusChange, 
  autoRefresh = true, 
  refreshInterval = 5000 
}: PaymentStatusTrackerProps) {
  const { 
    status, 
    loading, 
    error, 
    checkStatus, 
    isCompleted, 
    isFailed, 
    isCancelled, 
    isPending 
  } = usePaymentStatus(paymentId, autoRefresh, refreshInterval)

  // 支付步骤定义
  const getPaymentSteps = (): PaymentStep[] => {
    return [
      {
        id: 'initiated',
        title: '支付发起',
        description: '创建支付会话',
        status: 'completed'
      },
      {
        id: 'processing',
        title: '支付处理',
        description: '处理支付信息',
        status: isPending ? 'current' : isCompleted ? 'completed' : isFailed ? 'error' : 'pending'
      },
      {
        id: 'verification',
        title: '支付验证',
        description: '验证支付结果',
        status: isCompleted ? 'completed' : isFailed ? 'error' : 'pending'
      },
      {
        id: 'license',
        title: '许可证生成',
        description: '生成并发送许可证',
        status: isCompleted ? 'completed' : 'pending'
      }
    ]
  }

  const getStatusIcon = () => {
    switch (status) {
      case PaymentStatus.PENDING:
      case PaymentStatus.PROCESSING:
        return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      case PaymentStatus.COMPLETED:
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case PaymentStatus.FAILED:
        return <XCircle className="w-8 h-8 text-red-500" />
      case PaymentStatus.CANCELLED:
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />
      default:
        return <Clock className="w-8 h-8 text-gray-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case PaymentStatus.PENDING:
        return '等待支付确认...'
      case PaymentStatus.PROCESSING:
        return '正在处理支付...'
      case PaymentStatus.COMPLETED:
        return '支付成功完成！'
      case PaymentStatus.FAILED:
        return '支付失败'
      case PaymentStatus.CANCELLED:
        return '支付已取消'
      default:
        return '检查支付状态中...'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case PaymentStatus.PENDING:
      case PaymentStatus.PROCESSING:
        return 'text-blue-600'
      case PaymentStatus.COMPLETED:
        return 'text-green-600'
      case PaymentStatus.FAILED:
        return 'text-red-600'
      case PaymentStatus.CANCELLED:
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const steps = getPaymentSteps()

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 状态标题 */}
      <div className="text-center mb-8">
        <motion.div 
          className="flex items-center justify-center mb-4"
          key={status}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {getStatusIcon()}
        </motion.div>
        
        <h3 className={`text-xl font-semibold ${getStatusColor()}`}>
          {getStatusText()}
        </h3>
        
        <p className="text-gray-600 mt-2">
          支付ID: {paymentId.slice(-8)}
        </p>
      </div>

      {/* 进度步骤 */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {/* 步骤图标 */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              step.status === 'completed' 
                ? 'bg-green-500 border-green-500' 
                : step.status === 'current'
                ? 'bg-blue-500 border-blue-500'
                : step.status === 'error'
                ? 'bg-red-500 border-red-500'
                : 'bg-gray-100 border-gray-300'
            }`}>
              {step.status === 'completed' && (
                <CheckCircle className="w-6 h-6 text-white" />
              )}
              {step.status === 'current' && (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              )}
              {step.status === 'error' && (
                <XCircle className="w-6 h-6 text-white" />
              )}
              {step.status === 'pending' && (
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              )}
            </div>

            {/* 步骤信息 */}
            <div className="flex-1">
              <h4 className={`font-medium ${
                step.status === 'completed' 
                  ? 'text-green-800' 
                  : step.status === 'current'
                  ? 'text-blue-800'
                  : step.status === 'error'
                  ? 'text-red-800'
                  : 'text-gray-600'
              }`}>
                {step.title}
              </h4>
              <p className="text-sm text-gray-500">
                {step.description}
              </p>
            </div>

            {/* 连接线 */}
            {index < steps.length - 1 && (
              <div className={`absolute left-[2.4rem] mt-10 w-0.5 h-6 ${
                steps[index + 1].status === 'completed' || steps[index + 1].status === 'current'
                  ? 'bg-blue-300'
                  : 'bg-gray-200'
              }`} />
            )}
          </motion.div>
        ))}
      </div>

      {/* 错误信息 */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-800">状态检查失败</span>
            </div>
            <p className="text-red-700 text-sm mb-3">
              {error.message}
            </p>
            <button
              onClick={checkStatus}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              重试
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 刷新控制 */}
      {!autoRefresh && isPending && (
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={checkStatus}
            disabled={loading}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            手动刷新状态
          </button>
        </motion.div>
      )}

      {/* 完成状态的后续操作 */}
      {isCompleted && (
        <motion.div 
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <h4 className="font-semibold text-green-800 mb-2">
              🎉 支付完成！
            </h4>
            <p className="text-green-700 text-sm mb-3">
              您的许可证已经生成并发送到您的邮箱。
            </p>
            <div className="flex gap-2 justify-center">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                查看许可证
              </button>
              <button className="px-4 py-2 bg-white border border-green-300 text-green-700 hover:bg-green-50 rounded-lg text-sm font-medium transition-colors">
                下载应用
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}