'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Download, Apple, Shield, RotateCcw, Zap, Check, CreditCard, Star } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useAuth } from '@/lib/context/AuthContext'
import { formatPrice, TOPWINDOW_LICENSE_PRICE, FREE_TRIAL_DOWNLOAD_URL } from '@/config/pricing'

// 动态导入 PaymentSelector 组件以优化加载性能
const PaymentSelector = dynamic(() => import('./payments/PaymentSelector'), {
  loading: () => (
    <div className="flex items-center justify-center p-12">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
})

const trialFeatures = [
  {
    icon: Zap,
    text: "完整专业功能"
  },
  {
    icon: Shield,
    text: "无功能限制"
  },
  {
    icon: RotateCcw,
    text: "30天体验期"
  }
]

const licenseFeatures = [
  "永久使用权，无时间限制",
  "支持3台设备激活",
  "免费版本更新",
  "优先技术支持",
  "30天无条件退款保证",
  "无试用期限制"
]

export default function PricingSection() {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<'overview' | 'purchase'>('overview')
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'license'>('license')

  return (
    <section id="pricing" className="section-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container-custom relative">
        
        {/* 主要内容区域 */}
        <div className="text-center max-w-6xl mx-auto">
          
          {/* 标题区域 */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-md mb-6">
              开始您的 TopWindow 之旅
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              先免费体验30天完整专业功能，
              然后选择一次性买断，享受永久使用权。
            </p>
          </motion.div>

          {/* 视图切换 */}
          {viewMode === 'overview' ? (
            <>
              {/* 方案对比 */}
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* 30天免费试用 */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl relative">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">30天免费试用</h3>
                    <div className="text-4xl font-bold text-green-400 mb-2">FREE</div>
                    <p className="text-gray-300">完整功能 • 无限制 • 30天体验</p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    {trialFeatures.map((feature, index) => (
                      <motion.div
                        key={feature.text}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        viewport={{ once: true }}
                      >
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <feature.icon className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-gray-200">{feature.text}</span>
                      </motion.div>
                    ))}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-green-200">所有专业功能可用</span>
                    </div>
                    <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                      <p className="text-blue-200 text-sm text-center">
                        ⏰ 试用期结束后可选择购买专业版继续使用
                      </p>
                    </div>
                  </div>
                  
                  <a
                    href={FREE_TRIAL_DOWNLOAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 text-center"
                  >
                    <Apple className="w-5 h-5 inline mr-2" />
                    开始免费试用
                  </a>
                </div>

                {/* 专业许可证 */}
                <div className="bg-gradient-to-br from-primary/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-primary/50 shadow-2xl relative">
                  {/* 推荐标签 */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      永久使用
                    </div>
                  </div>
                  
                  <div className="text-center mb-6 mt-4">
                    <h3 className="text-2xl font-bold mb-2">专业许可证</h3>
                    <div className="text-4xl font-bold text-primary mb-2">{formatPrice(TOPWINDOW_LICENSE_PRICE)}</div>
                    <p className="text-gray-300">一次性买断 • 永久使用</p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    {licenseFeatures.map((feature, index) => (
                      <motion.div
                        key={feature}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        viewport={{ once: true }}
                      >
                        <div className="w-8 h-8 bg-primary/30 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-white font-medium">{feature}</span>
                      </motion.div>
                    ))}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-500/30 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-yellow-400" />
                      </div>
                      <span className="text-yellow-200">完整专业功能</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setViewMode('purchase')}
                    className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary-dark hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    购买永久许可证
                  </button>
                </div>
              </motion.div>
            </>
          ) : (
            /* 购买界面 */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* 返回按钮 */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={() => setViewMode('overview')}
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  ← 返回方案对比
                </button>
              </div>

              {/* PaymentSelector 组件 */}
              <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              }>
                <PaymentSelector
                  productId="topwindow-license"
                  onPaymentStart={() => console.log('Payment started')}
                  onPaymentSuccess={() => console.log('Payment success')}
                  onPaymentCancel={() => setViewMode('overview')}
                  showComparison={true}
                />
              </Suspense>
            </motion.div>
          )}
          
          {/* 信任指标 - 仅在概览模式显示 */}
          {viewMode === 'overview' && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">30天免费试用</h4>
                  <p className="text-gray-400 text-sm">
                    完整功能体验，零风险
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">隐私优先</h4>
                  <p className="text-gray-400 text-sm">
                    无数据收集和跟踪
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">一次性付费</h4>
                  <p className="text-gray-400 text-sm">
                    买断制，无需订阅
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}