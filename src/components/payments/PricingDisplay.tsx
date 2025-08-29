'use client'

import { motion } from 'framer-motion'
import { PricingDisplayProps } from '@/types/payment-ui'
import { Check } from 'lucide-react'
import FeatureList from './FeatureList'

export default function PricingDisplay({ 
  price, 
  currency, 
  originalPrice, 
  discount, 
  features,
  className = '' 
}: PricingDisplayProps) {
  const formatPrice = (amount: number, curr: string) => {
    const symbol = curr === 'USD' ? '$' : curr
    return `${symbol}${amount.toFixed(2)}`
  }

  const discountAmount = originalPrice && discount ? originalPrice - price : 0
  const discountPercentage = originalPrice && discountAmount ? 
    Math.round((discountAmount / originalPrice) * 100) : 0

  return (
    <motion.div 
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* 价格区域 */}
      <div className="bg-gradient-to-br from-primary/10 to-blue-50 p-6 text-center">
        {/* 折扣标签 */}
        {discount && discountPercentage > 0 && (
          <motion.div 
            className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium mb-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <span>Save {discountPercentage}%</span>
          </motion.div>
        )}

        {/* 价格显示 */}
        <div className="flex items-center justify-center gap-3 mb-2">
          {originalPrice && originalPrice > price && (
            <span className="text-lg text-gray-500 line-through">
              {formatPrice(originalPrice, currency)}
            </span>
          )}
          <span className="text-4xl md:text-5xl font-bold text-gray-900">
            {formatPrice(price, currency)}
          </span>
        </div>

        <p className="text-gray-600 font-medium">
          One-time purchase • Lifetime usage
        </p>

        {discountAmount > 0 && (
          <motion.p 
            className="text-green-600 font-medium mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Save instantly {formatPrice(discountAmount, currency)}
          </motion.p>
        )}
      </div>

      {/* 功能列表 */}
      <div className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4 text-center">
          Included features
        </h4>
        <FeatureList features={features} showCheckmarks={true} />
        
        {/* 价值声明 */}
        <motion.div 
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Best value</span>
          </div>
          <p className="text-sm text-green-700">
            Compared to other window management tools on the market, TopWindow provides more comprehensive features,
            better pricing, and free lifetime updates.
          </p>
        </motion.div>

        {/* 退款保证 */}
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p className="text-sm text-gray-600">
            <span className="font-medium">30-day money-back guarantee</span>
            <br />
            Not satisfied? Unconditional full refund
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}