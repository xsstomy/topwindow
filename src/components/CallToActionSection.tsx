'use client'

import { motion } from 'framer-motion'
import { Download, Apple, Shield, RotateCcw, Zap, Check } from 'lucide-react'

const features = [
  {
    icon: Shield,
    text: "Safe & Secure"
  },
  {
    icon: RotateCcw,
    text: "Free Updates Forever"
  },
  {
    icon: Zap,
    text: "Instant Activation"
  }
]

export default function CallToActionSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container-custom relative">
        
        {/* 主要内容区域 */}
        <div className="text-center max-w-4xl mx-auto">
          
          {/* 标题区域 */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-md mb-6">
              Get TopWindow Today
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Transform your macOS workflow with the ultimate window management tool. 
              Simple, powerful, and designed for productivity.
            </p>
          </motion.div>
          
          {/* 定价卡片 */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            
            {/* 价格 */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <span className="text-6xl md:text-7xl font-bold text-green-400">FREE</span>
              </div>
              <p className="text-gray-300 text-lg">
                Always free • No ads • No subscription required
              </p>
            </div>
            
            {/* 特性列表 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-gray-200 font-medium text-center">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>
            
            {/* 下载按钮 */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <button className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-3 text-lg">
                <Apple className="w-6 h-6" />
                Download for macOS
                <Download className="w-5 h-5" />
              </button>
              
              <p className="text-gray-400 text-sm">
                Compatible with macOS 13.0 or later
              </p>
            </motion.div>
          </motion.div>
          
          {/* 保证和信任指标 */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">30-Day Guarantee</h4>
                <p className="text-gray-400 text-sm">
                  Not satisfied? Get a full refund
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Privacy First</h4>
                <p className="text-gray-400 text-sm">
                  No data collection or tracking
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                <RotateCcw className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Lifetime Updates</h4>
                <p className="text-gray-400 text-sm">
                  Always get the latest features
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* 紧迫感元素 */}
          <motion.div 
            className="mt-12 inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-green-300 font-medium">
              ✨ Open Source • Forever Free
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}