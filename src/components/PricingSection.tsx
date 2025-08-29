'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Download, Apple, Shield, RotateCcw, Zap, Check, CreditCard, Star } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useAuth } from '@/lib/context/AuthContext'
import { formatPrice, TOPWINDOW_LICENSE_PRICE, FREE_TRIAL_DOWNLOAD_URL } from '@/config/pricing'

// Dynamically import PaymentSelector component to optimize loading performance
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
    text: "Full Professional Features"
  },
  {
    icon: Shield,
    text: "No Feature Limitations"
  },
  {
    icon: RotateCcw,
    text: "30-Day Trial Period"
  }
]

const licenseFeatures = [
  "Lifetime Usage Rights",
  "Single Device Activation",
  "Free Version Updates",
  "Technical Support",
  "30-Day Money-Back Guarantee"
]

export default function PricingSection() {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<'overview' | 'purchase'>('overview')
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'license'>('license')

  return (
    <section id="pricing" className="section-padding bg-gradient-to-br from-gray-light to-blue-50 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-300/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container-custom relative">
        
        {/* Main Content Area */}
        <div className="text-center max-w-6xl mx-auto">
          
          {/* Title Area */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-md mb-6">
              Start Your TopWindow Journey
            </h2>
            <p className="text-xl md:text-2xl text-gray-secondary leading-relaxed max-w-3xl mx-auto">
              First, experience 30 days of full professional features for free,
              then choose a one-time purchase for lifetime usage rights.
            </p>
          </motion.div>

          {/* View Toggle */}
          {viewMode === 'overview' ? (
            <>
              {/* Plan Comparison */}
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* 30-Day Free Trial */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl relative">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-text mb-2">30-Day Free Trial</h3>
                    <div className="text-4xl font-bold text-green-600 mb-2">FREE</div>
                    <p className="text-gray-secondary">Full Features • No Limitations • 30-Day Experience</p>
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
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <feature.icon className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-text">{feature.text}</span>
                      </motion.div>
                    ))}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-green-700">All Professional Features Available</span>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-700 text-sm text-center">
                        ⏰ Choose to purchase professional version after trial period to continue using
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
                    Start Free Trial
                  </a>
                </div>

                {/* Professional License */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl relative">
                  {/* Simple badge */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Professional
                    </div>
                  </div>
                  
                  <div className="text-center mb-6 mt-4">
                    <h3 className="text-2xl font-bold text-gray-text mb-2">Professional License</h3>
                    <div className="text-4xl font-bold text-primary mb-2">{formatPrice(TOPWINDOW_LICENSE_PRICE)}</div>
                    <p className="text-gray-secondary">One-time Purchase • Lifetime Usage</p>
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
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-gray-text font-medium">{feature}</span>
                      </motion.div>
                    ))}
                    {/* Removed extra promotional content */}
                  </div>
                  
                  <button
                    onClick={() => setViewMode('purchase')}
                    className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary-dark hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Purchase Lifetime License
                  </button>
                </div>
              </motion.div>
            </>
          ) : (
            /* Purchase Interface */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Back Button */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={() => setViewMode('overview')}
                  className="text-gray-secondary hover:text-gray-text transition-colors flex items-center gap-2"
                >
                  ← Back to Plans Comparison
                </button>
              </div>

              {/* PaymentSelector Component */}
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
          
          {/* Trust Indicators - Only shown in overview mode */}
          {viewMode === 'overview' && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-text mb-1">30-Day Free Trial</h4>
                  <p className="text-gray-secondary text-sm">
                    Complete feature experience, zero risk
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-text mb-1">Privacy First</h4>
                  <p className="text-gray-secondary text-sm">
                    No data collection and tracking
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-text mb-1">One-time Payment</h4>
                  <p className="text-gray-secondary text-sm">
                    Buy-to-own, no subscription required
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